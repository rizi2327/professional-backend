import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
o



const userSchema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    full_name:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },cover_image:{
          type:String,
    },
    watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref :"Video"
        }
    ],
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
});
//custom methods
userSchema.methods.isPasswordMatch= async function (password){
    return await bcrypt.compare(passeord,this.password);
}
userSchema.methods.generateAccessToken =function(){
     return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            full_name:this.full_name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken =function(){
    return jwt.sign(
        {
            _id:this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
export const User=mongoose.model("User",userSchema);