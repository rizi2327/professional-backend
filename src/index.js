// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import dotenv from "dotenv";

import connectionDB from "./db/index.js";

dotenv.config({
    path:'./.env'
});

connectionDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,(req,res)=>{
        console.log(`Sever is listen on ${process.env.PORT}`);
    })
    app.on((error)=>{
        console.log('Server listening failed !!! ',error);
        
    })
})
.catch((error)=>
{
    console.log('MONGO_DB connection is failed !!! ',error);
})









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