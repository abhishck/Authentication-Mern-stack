import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    verifyOtp:{
        type:String,
        default:""
    },
    verifyOtpExpiresAt:{
        type:Number,
        default:0
    },
    resetOtp:{
        type:String,
        default:""
    },
    resetOtpExpiresAt:{
        type:Number,
        default:0
    },
},{timestamps:true})

const userModel=mongoose.model("User",userSchema)

export default userModel;