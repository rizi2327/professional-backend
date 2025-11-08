import express from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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


export default router;
