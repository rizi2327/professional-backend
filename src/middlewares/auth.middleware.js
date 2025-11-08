import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // get token from cookie or Authorization header
    try {
        console.log("Incoming request cookies:", req.cookies);
        console.log("Authorization header:", req.headers.authorization);
        
        let token = null;
        
        // First try to get from cookies
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        // Then try Authorization header
        else if (req.headers?.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, "unauthorized request: token missing");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "invalid access token: user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        // Re-throw as ApiError so global error handler can format it
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});