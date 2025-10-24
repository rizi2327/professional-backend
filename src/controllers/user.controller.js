import { User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

  //WRITE STEPS TO REGISTER USER
  //.1 get data from frontend
  //.2 validate data
  //.3 check user already exist with email or username
  //.4 upload avatar and cover image to cloudinary
  //.5 create user in db
  //.6 remove password and refresh token from response
  //.7 check user created or not
  //.8 send response to frontend




export const registerUser = asyncHandler(async (req,res)=>{
 
// //   const { name, email, password } = req.body;
//   res.status(201).json({
//     message:"User registered successfully",
//     // user: { name, email }
//   });

  // Logic Building kly :
  //steps lihkn
  //1. get data from fonntend
//     console.log("Body:", req.body);
// console.log("Files:", req.files);

    const {fullName,email,username,password, avatar}=req.body;
  // console.log("email:", email)//check krny kly k data aa raha bhi rha hai k nhi
  //2. vaidate krny kly
  if(!password || !email || !username || !fullName )
    {
      // return res.status(400).json({
      //   message:"all fields are required"
      throw new ApiError(400,"all fields ara  required");
      
    // });
  }

  // step 3 : check krny kly k user already exist krta hai k nhi
  const existUser= await User.findOne({
    $or:[
      {email},
      {username}
    ]
  });

  if(existUser){
    throw new ApiError(409,"user already exist with this email or username");
  }

  //step 4 : check krna k avtar hai ya nhi and cover Image bhi
  const avatarLocalPath=req.files?.avatar[0]?.path;
  const imageLocalPath=req.files?.coverImage[0]?.path;
  if(!avatarLocalPath)
  {
    throw new ApiError(400,
      'avatar is required'
    )
  }



   const Avatar=await uploadCloudinary(avatarLocalPath);
   const coverImage= await uploadCloudinary(imageLocalPath);

   if(!Avatar)
   {
    throw new ApiError(500,
      'error  in uploading avatar'
    )
   }
// //step 5 : create user in db
   const user=await User.create({
    fullName,
    email,
    password,
    username:username.toLowerCase(),
    avatar:Avatar.url,
    coverImage:coverImage?.url || "",
   })
//    //step 6 :remove password and refresh token from response
//   //  user.password=undefined;
//   //  user.refreshToken= undefined

//   //step 7: check krny kly k user create hua hai k nhi

  const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"//yeh dono field remove kr dega response se
  );

  if(!createdUser){
    throw new ApiError(500,
      'error in creating user'
    )
  }
  //step 8: send response to frontend
  return res.status(201).json(
    new ApiResponse(200, "User registered successfully")
  )

});