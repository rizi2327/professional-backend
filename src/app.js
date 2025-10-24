import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { ApiError } from './utils/ApiError.js';

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("Public"));
app.use(cookieParser());  



//routes
import router from './routes/user.route';

app.use('/api/v1/users',router);
// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err); // for debugging

  // Agar error ApiError ka instance hai
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: err.stack, // helpful during development
    });
  }

  // Fallback for unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});


//http://localhost:5000/users/register

export { app };