import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/dbConfig.js"
import errorHandler from "./Middleware/errorHandler.js"
import router from "./Routes/authRoutes.js"
import cookieParser from "cookie-parser"
import userRouter from "./Routes/userRoutes.js"
import cors from "cors"

dotenv.config()
dbConnect()

const app =express()

const port = process.env.PORT || 5001;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.get("/",(req,res)=>{
    res.send("welcome")
})
app.use("/api/auth",router)
app.use("/api/user",userRouter)
app.use(errorHandler)

app.listen(port ,()=>{
    console.log(`App is listening on the port ${port}`)
})