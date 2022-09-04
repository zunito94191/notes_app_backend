import userModel from "../model/userModel.js";
import noteModel from "../model/noteModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import otpModel from "../model/otpModel.js";
import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
import { promisify } from "util";

const signToken = (email) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const sendToken = function (user, statusCode, res) {
  const token = signToken(user.email);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    user: user,
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password,isGoogle } = req.body;
  // check if email and password exits
  if(isGoogle){
    const userWithemail = await userModel.findByPk(email);
    if(!userWithemail){
        const newUser = await userModel.create({...req.body});
        await noteModel.create({title:"Untitled",body:"",emailId:email});
        return sendToken(newUser,200,res);
    }
    return sendToken(userWithemail,200,res)
  }else{
  const userWithemail = await userModel.findOne(
    { where: { email } },
    { attributes: ["email", "name", "password"] }
  );
  if (!userWithemail) {
    return next(new AppError("User Not found", 400));
  }
  if (!await bcrypt.compare(password, userWithemail.dataValues.password)) {
    return next(new AppError("Incorect email or Password", 401));
  }
  const confirmUser = userWithemail.dataValues;
  delete confirmUser.password;
  // check if email and password are correct
  return sendToken(confirmUser, 200, res);}
});

export const createUser = catchAsync(async (req, res, next) => {
  {
    const { email, password } = req.body;
    const alreadyExistedUsers = await userModel.findOne({ where: { email } });

    if (alreadyExistedUsers) {
        if(alreadyExistedUsers.password==null){
            return res.status(400).json({
                status:"fail",
                message:"Login with Google"
            })
        }
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }
    console.log(password);
    const bcryptPassword = await bcrypt.hash(password, 12);
    var createUser = await userModel.create({
      ...req.body,
      password: bcryptPassword,
    });

    const newNote = await noteModel.create({emailId:req.body.email,title:"Untitled",body:""});
  }

  let { password, ...newUser } = createUser.dataValues;
  sendToken(newUser, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await userModel.findByPk(decoded.email, {
    attributes: ["name", "email", "photo"],
  });
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this id doesn't exists", 401)
    );
  }
  req.user = freshUser.dataValues;
  // Grands access to protected route
  next();
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  const otpDoc = await otpModel.findOne({ where:{emailId: email} });
  if (otpDoc.otp == otp) {
    res.status(200).json({
      status: "success",
      messgae:"Otp Verified"
    });
  } else {
    res.status(400).json({
      status: "fail",
      message:"Wrong Otp Send"
    });
  }
});

export const forgetPassword = catchAsync(async (req, res, next) => {
    const {email,newpassword} = req.body;    
        const bcryptPassword =  await bcrypt.hash(newpassword,12);
        const user = await userModel.findByPk(email)
        await user.update({password:bcryptPassword},{where:{email:email}});
        const {password,...updatedUser} =  user.dataValues;
        sendToken(updatedUser,200,res);
});
