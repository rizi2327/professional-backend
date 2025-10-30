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


    const {fullName,email,username,password, avatar,coverImage}=req.body;
  // console.log("email:", email)//check krny kly k data aa raha bhi rha hai k nhi
  //2. vaidate krny kly
  if(!password || !email || !username || !fullName )
    {
      // return res.status(400).json({
      //   message:"all fields are required"
      throw new ApiError(400,"all fields ara  required");
      
    // });
  }
     console.log("🖼️ CoverImage file:", req.files?.coverImage?.[0]?.originalname);

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
  // const imageLocalPath=req.files?.coverImage[0]?.path;

  //classic way to write above line
  let imageLocalPath="";
  if(req.files?.coverImage?.length >0)
  {
    imageLocalPath=req.files.coverImage[0].path;
  }

  if(!avatarLocalPath)
  {
    throw new ApiError(400,
      'avatar is required'
    )
  }



   const Avatar=await uploadCloudinary(avatarLocalPath);
   const CoverImage= await uploadCloudinary(imageLocalPath);

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
    coverImage:CoverImage?.url || "",
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
    new ApiResponse(200, "User registered successfully",createdUser)
  )

});

//generate tokens
const generateAccessAndRefreshToken=async(userId)=>{
  try {
      const user =await User.findById(userId);
  const accessToken=user.generateAccessToken();
  const refreshToken=user.generateRefreshToken();
  user.refreshToken=refreshToken;
  await user.save({validateBeforeSave:false})
  return({accessToken,refreshToken})

  } catch (error) {
    throw new ApiError(501,'something went wrong in generating access and refresh token')
    
  }
}


export const LoginUser=asyncHandler(async(req, res)=>
{
   // get data from from frontend req.body
   //username or email k through login kr skty hai
   //validate krna ya user or email find krna
   //password check krna
    //generate jwt tokens (access and refresh)
    //send tokens to cookies

    // step1: get data from frontend
    const {username,email,password}=req.body;
    // step2: validate data
    if(!username || !email)
    {
      throw  new ApiError(400,"username or email are required")
    }
    //step 3 find username or x
    const user=await User.findOne(
      $or [
        {username},{email}
      ]
    )

    if(!user){
      throw new ApiError(404,"user is not exist")
    }
    const ispasswordvalid=await user.isPasswordMatch(password);

    if(!ispasswordvalid)
    {
      throw new ApiError(401,"Invalid user credentials");
    }

    const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id);

    const  loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
      httpOnly:true,
      secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          user:loggedInUser,accessToken,refreshToken
        },
        "user  loggedIn successfully"
      )
    )

  })
