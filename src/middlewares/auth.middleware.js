import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // get token from cookie or Authorization header
    try {
        const token = req.cookies?.accessToken || 
            req.headers?.authorization?.replace("Bearer ", "") || 
            null;

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