import {v2 as cloudinary} from 'cloudinary';
import fs, { unlink }  from  'fs';

cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET
    });


const uploadCloudinary= async(localFilePath)=>
{
    try {
        if(!localFilePath) return null;
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"//khud detect krlega file type
        })
        console.log("file uploaded to cloudinary",response.url);
        return response;
      } catch (error) {
     fs.unlinkSync(localFilePath);
     //remove local file which is temporary saved
     return null;   
    }
}


export { uploadCloudinary };