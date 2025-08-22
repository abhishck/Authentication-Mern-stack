import express from "express"
import { isAuthenticated, login, logOut, register, resendOtp, sendOtp, verifyEmail } from "../Controllers/authControllers.js"
import validateToken from "../Middleware/validateToken.js"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logOut)
router.get("/send-otp",validateToken,sendOtp)
router.get("/is-authenticated",validateToken,isAuthenticated)
router.post("/verify-otp",validateToken,verifyEmail)
router.get("/resend-otp",validateToken,resendOtp)

export default router;