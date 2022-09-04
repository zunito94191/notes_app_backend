import express from "express";
import { protect } from "../controller/authController.js";
import { sendMail,generateOtp } from "../controller/collabController.js";
const emailRouter = express.Router();

emailRouter.post("/collaborator",protect,sendMail)
emailRouter.post("/generateotp",generateOtp)
export default emailRouter;