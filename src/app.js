import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
const app=express();

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("Public"));
app.use(cookieParser());  



//routes
import router from './routes/user.route';

app.use('/api/v1/users',router);

//http://localhost:5000/users/register

export { app };