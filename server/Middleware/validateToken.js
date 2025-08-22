import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"

const validateToken=asyncHandler(async(req,res,next)=>{
    let token=req.cookies.token;

    if(!token){
        res.status(401);
        throw new Error("Unathorised!!")
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach userId for later use
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
})

export default validateToken