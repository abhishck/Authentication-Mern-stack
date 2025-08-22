import express from "express"
import validateToken from "../Middleware/validateToken.js";
import userData from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data",validateToken,userData)

export default userRouter;