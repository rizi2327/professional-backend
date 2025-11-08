import { User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"

  //WRITE STEPS TO REGISTER USER
  //.1 get data from frontend
  //.2 validate data
  //.3 check user already exist with email or username
  //.4 upload avatar and cover image to cloudinary
  //.5 create user in db
  //.6 remove password and refresh token from response
  //.7 check user created or not
  //.8 send response to frontend



//user register controller
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

//login controller
export const loginUser=asyncHandler(async(req, res)=>
{
  console.log('loginUser called, body:', req.body);
  // get data from from frontend req.body
  //username or email k through login kr skty hai
  //validate krna ya user or email find krna
  //password check krna
   //generate jwt tokens (access and refresh)
   //send tokens to cookies

    // step1: get data from frontend
    const {username,email,password}=req.body;
    // step2: validate data
    if(!(username || email)){
      throw new ApiError(400,"username and email is required")
    }
    // if(!username || !email) wrong
    //if(!(username || email)) sahi
    // {
    //   throw  new ApiError(400,"username or email are required")
    // }
    //step 3 find username or x
    const user = await User.findOne({
  $or: [{ username }, { email }]
});


    if(!user){
      throw new ApiError(404,"user is not exist")
    }
    const ispasswordvalid=await user.isPasswordMatch(password);

    if(!ispasswordvalid)
    {
      throw new ApiError(401,"Invalid user credentials");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

    const  loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: false,
      // sameSite: 'None',
      // path: '/',
      // domain: 'localhost'
    }

    console.log("Setting cookies with options:", options);
    console.log("Access token:", accessToken);
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "user loggedIn successfully"
      )
    )

  })
//logout controller
export const logOutUser=asyncHandler(async(req,res)=>{
  console.log('Cookies received:', req.cookies);
  await User.findByIdAndUpdate(// ye Mongoose ka mthod hai jis mn wo user ko id k through access krta hai or phir us k baad usko update kr data hai .
    // req.user._id k through ye user ko access kry ga database mn sy
    req.user._id,{
      $set:{
        // $set method ye btata hai k ap ny kn kn sy fields update krny hain jsy ap yhn  refreshToken ko update kia hai 
        refreshToken:undefined
      }

    },
    {
      //agr return new true nhi kro gy tu old user return kry gy with refreshToken k sath 
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    sameSite: 'strict'
  }
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "user logged out"))
})

//AccessRefresh token controller to get refresh token 
export const accessRefreshToken = asyncHandler(async(req,res)=>{
  
  // 1) Client refresh token cookie ya body me de raha hota hai
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

  if(!incomingRefreshToken){
    // Agar user ne refresh token bheja hi nahi → wo unauthorized hai
    throw new ApiError(401,"unauthorized request")
  } 

  // 2) Validate token → check it is real or fake
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
  
    // decodedToken ab kuch is tarha hoga:
    // { _id: '690cd479cbf18de857649bb7', iat: 1762537928, exp: 1763401928 }
  
    // 3) Database ke ander user ko find karo
    const user = await User.findById(decodedToken._id)//qk jb ap ny refresh token gen kia tha tb ap ny _id di thi us k through ap user ko get kro gy
  
    if(!user){
      throw new ApiError(401,"Invalid refresh token - user not found")
    }
  
    // 4) Ensure user ke record me jo refresh token stored hai
    // Wo client se match karta ho (hacking se bachne ke liye)
    if(incomingRefreshToken !== user.refreshToken){
      throw new ApiError(401,"Refresh token is expired or already used")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
    // 5) New Access Token generate kar do
    // const newAccessToken = user.generateAccessToken()
  
    // // Optionally, Refresh Token bhi rotate karo (security best practice)
    // const newRefreshToken = user.generateRefreshToken()
    // user.refreshToken = newRefreshToken
    // await user.save({ validateBeforeSave:false })
  
    //ye method oper bnaya hua hai is ly 
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    // 6) Send new tokens
    return res
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,{httpOnly:true,secure:false})// ye options bhi use kr skty ho
    .json(
     new ApiResponse(
      200,
      {accessToken,newRefreshToken},
      "Access Token is refreshed "
     )
    )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")  
  }

})
