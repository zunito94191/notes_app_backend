import express from "express";
import * as authController from "../controller/authController.js";
const userRouter = express.Router();

userRouter.route("/signup").post(authController.createUser);
userRouter.route("/login").post(authController.login);
userRouter.post("/forgetpassword",authController.forgetPassword);
userRouter.post("/verifyotp",authController.verifyOtp);
export default userRouter;