import express from 'express';
const app=express();
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"; // Importing user routes

import connectionDB from "./db/index.js";

app.use(express.json());
app.use("/api/v1/users", userRoutes); 

dotenv.config({
    path:'./.env'
});

connectionDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Sever is listen on ${process.env.PORT}`);
    })
    app.on('error',(error)=>{//app.on requires event name and callback function
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