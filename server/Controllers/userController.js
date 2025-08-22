import asyncHandler from "express-async-handler"
import userModel from "../Models/authModel.js";

export const userData= asyncHandler(async(req,res)=>{
    const userId=req.userId;
    try {
        const user=await userModel.findOne({_id:userId});

        if(!user){
            res.status(404);
            throw new Error("User not found!!")
        }

        return res.status(200).json({success: true,user:{
            name:user.name,
            email:user.email,
            isAccountverified:user.isAccountVerified,
        }})
    } catch (error) {
          res.status(400);
    console.log("user data error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
    }
})

export default userData
