import mongoose , {Schema} from "mongoose";


const subscriptionSchema= new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//jo sabscribe krta hai 
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,//jis ko sabscribe kia jata hai
        ref:"User"
    }
},{timestamps:true})

export const Sabscription=mongoose.model("Subscription",subscriptionSchema);


