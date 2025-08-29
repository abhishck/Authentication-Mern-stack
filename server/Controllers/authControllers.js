import userModel from "../Models/authModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "../template/emailTemplate.js";

export const register = asyncHandler(async (req, res) => {
  let { name, email, password} = req.body;

  if (!name || !email || !password ) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  email = email.trim().toLowerCase();

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists!!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      
    });

    await user.save();

    if (!process.env.JWT_SECRET) {
      res.status(500);
      console.log("jwt secret is not set in .env file !!");
      throw new Error("Something Went Wrong!!");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    const mailOption = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Welcome to Auth ✔",
      text: "Welcome!!",
      html: Welcome_Email_Template.replace("{name}", user.name),
    };

    const info = await transporter.sendMail(mailOption);
    console.log(info);

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("register error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

export const login = asyncHandler(async (req, res) => {
  let { email, password, } = req.body;
  if (!email || !password ) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  email = email.trim().toLowerCase();

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User Not Found!!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials!!");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "User login successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("login error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

export const logOut = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "logout successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("logout error :", error.message);
  }
});

export const isAuthenticated=asyncHandler(async(req,res)=>{
  return res.json({success:true})
})

export const sendOtp = asyncHandler(async (req, res) => {
  const userId = req.userId;

  console.log(userId);
  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      res.status(403);
      throw new Error("Unauthorised!!");
    }

    if(user.isAccountVerified){
      res.status(400);
      throw new Error("Account is already verified!")
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Verify Your Account  ✔",
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    const info = await transporter.sendMail(mailOption);
    console.log("message sent : ", info);

    return res
      .status(200)
      .json({ success: true, message: "otp send successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("send otp error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      res.status(404);
      throw new Error("User not found!!");
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      res.status(400);
      throw new Error("Invalid Otp");
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      res.status(400);
      throw new Error("otp expired!!");
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "account verified successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("verify otp error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});

export const resendOtp = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      res.status(404);
      throw new Error("user not found!!");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // user.isAccountVerified=true;
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Verify Your Account  ✔",
      html: Verification_Email_Template.replace("{verificationCode}", otp),
    };

    const info = await transporter.sendMail(mailOption);
    console.log("message sent : ", info);

    return res
      .status(200)
      .json({ success: true, message: "otp send successfully!!" });
  } catch (error) {
    res.status(400);
    console.log("send otp error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
});


export const sendForgetEmail=asyncHandler(async(req,res)=>{
  let {email}=req.body;

 email= email.trim().toLowerCase();

 try {
  const user=await userModel.findOne({email});
  if(!user){
    res.status(404);
    throw new Error("User not Found!!")
  }

 const otp=Math.floor(100000 * Math.random() + 900000)

 user.resetOtp=otp;
 user.resetOtpExpiresAt= Date.now() + 15*60*60*1000

 await user.save();
  
  const mailOption={
    from:process.env.SENDER_MAIL,
    to:user.email,
    subject:"Reset your Password",
    html:Verification_Email_Template.replace("{verificationCode}",otp)
  }

  const info=await transporter.sendMail(mailOption);
  console.log("message sent : " ,info)

  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"15m"});

  res.cookie("token",token,{
    httpOnly:true,
    secure: process.env.NODE_ENV ==="production",
    sameSite:process.env.NODE_ENV === "production" ? "none" :"strict",
    maxAge: 15*60 *60 *1000
  })

  return res.json({success:true,message:"otp is send to your email!!"})

 } catch (error) {
 res.status(400);
    console.log("email forget error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
 }
})

export const verifyForgetOtp=asyncHandler(async(req,res)=>{
  const userId=req.userId;
  const {otp}=req.body;
   try {
    const user=await userModel.findOne({_id:userId})

    if(!user){
      res.status(404);
      throw new Error("user not found !!")
    }

  if(user.resetOtp=== "" || user.resetOtp !==otp){
    res.status(400);
    throw new Error("Invalid otp")
  }

  if(user.resetOtpExpiresAt < Date.now()){
    res.status(400)
    throw new Error("otp expired!!")

  }

  res.json({success:true,message:"otp verified successfully!!"})
   } catch (error) {
    res.status(400);
    console.log("verify forget error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
   }
})

export const resetPassword=asyncHandler(async(req,res)=>{
  const userId=req.userId;
  const {newPassword,confirmPassword}=req.body;
  console.log(newPassword)
  if(newPassword !==confirmPassword){
    return res.json({success:false,message:"password not matched"})
  }
  try {
    const user= await userModel.findOne({_id:userId});

    if(!user){
      res.status(404);
      throw new Error("User not found !!")
    }

    const updatedHashPassword=await bcrypt.hash(newPassword,10);

    user.password=updatedHashPassword;
    await user.save();

    res.clearCookie("token",{
      httpOnly:true,
      secure:process.env.NODE_ENV=== "production",
      sameSite:process.env.NODE_ENV==="production" ? "none" : "strict"
    })

    return res.json({success:true,message:"password updated successfully"})

  } catch (error) {
     res.status(400);
    console.log("reset password error :", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
})



