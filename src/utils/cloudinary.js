import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const uploadCloudinary = async(localFilePath) => {
  try {
    if(!localFilePath) return null;
    
    console.log("📁 Checking file exists:", localFilePath);
    console.log("🔍 File exists:", fs.existsSync(localFilePath));
    
    // ✅ Check if file exists before upload
    if (!fs.existsSync(localFilePath)) {
      console.error("❌ File not found for upload:", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    
    console.log("✅ File uploaded to cloudinary:", response.url);
    
    // ✅ Safe file deletion
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🗑️ Local file deleted successfully");
    }
    console.log("🌐 Cloudinary Response:", response);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    
    // ✅ Safe file deletion in catch block
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🗑️ Local file deleted after error");
    }
    
    return null;   
  }
}

export { uploadCloudinary };