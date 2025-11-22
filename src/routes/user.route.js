import express from "express";
import { 
    accessRefreshToken,
    changeCurrentPassword,
    deleteUserAccount, 
    loginUser,
    getWatchHistory, 
    logOutUser, 
    registerUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    updateUserDetails ,
    getCurrentUserProfile
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";
const router = express.Router();

//user register route with middleware upload which upload file to multer sy cloudinary 
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),registerUser);



//user login route 
 router.route("/login").post(loginUser);

 //user logout route with middleware verify user is logged or not  so verify  JWT middleware inject before logout
 router.route("/logout").post(verifyJWT,logOutUser);
 router.route("/refresh-token").post(accessRefreshToken)//route to access refresh token
 router.route("/change-password").post(verifyJWT,changeCurrentPassword);//route to change current password
 router.route("/c/:username").get(verifyJWT,getCurrentUserProfile);//route to get current user profile
 router.route("/watch-history").get(verifyJWT,getWatchHistory);//route to get user watch history
 router.route("/delete-user").delete(verifyJWT,deleteUserAccount);//route to delete user account
 router.route("/update-user").patch(verifyJWT,updateUserDetails) ;//route to update user details
 router.route("/update-user-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);//route to update user avatar
 router.route("/update-cover-image").put(verifyJWT,upload.single("/coverImage"),updateUserCoverImage);//route to update user cover image




export default router;
