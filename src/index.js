// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import dotenv from "dotenv";

import connectionDB from "./db/index.js";

dotenv.config({
    path:'./.env'
});

connectionDB();









/*
1st Approch to handle database index.js mn funtion create kr lena

import express from "express"
const app= express();

(async()=>{
   try {
     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
     app.on('ERROR',()=>{
        console.log('ERROR',error);
        throw error;
     })
     app.listen(process.env.PORT,()=>
    {
        console.log(`Server is listening on ${process.env.PORT}`)
    })
   } catch (error) {
        console.error('ERROR:',error)
        throw error
   }
})()*/