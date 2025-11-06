import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT=asyncHandler(async(req,_,next)=>{//jb koi  paramete use nhi ho rha hai tu "_" use krn us ki jaga pr 

    try {
        req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unautorized request")
        }
        const decodedToken = json.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user=await User.findById(decodedToken._id).select(
            "-password -refreshToken"
         )
         if(!user){
            throw new ApiError(401,"invalid access Token");
         }
         req.user= user;
         next();
    } catch (error) {
    throw new ApiError(401,error?.message || " Invalid access token")
    }

})