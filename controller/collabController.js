import catchAsync from "../utils/catchAsync.js";
import nodemailer from "nodemailer";
import noteModel from "../model/noteModel.js";
import otpModel from "../model/otpModel.js";
import userModel from "../model/userModel.js";
export const sendMail = catchAsync(async(req,res,next)=>{
  const notes = await noteModel.findByPk(req.body.noteId);
  const emails = req.body.email.split(",");
  let found  = true;
  for(const email of emails){
    if(email ==req.user.email)continue
    const user = await userModel.findByPk(email);
  if(user){
  await notes.addUser(user,{through:{role:req.body.role}});
  const access = req.body.role=="viewer"?"244uc7h70x":"3tcm09aw1g"
  const view = req.body.role=="viewer"?"view":"edit"
    let transporter =nodemailer.createTransport({
        host: "smtp.office365.com",
        port:587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      const title = notes.dataValues.title ?? "Untitled"
      let info = transporter.sendMail({
        from: "neelaksh_g@outlook.com", // sender address
        to: req.body.email, // list of receivers
        subject: `Document shared with you ${title}`, // Subject line
        html:'<div><p>'+req.user.name+'('+req.user.email+') has invited you to '+view+' the following doc <a href="https://notes-app-361513.el.r.appspot.com/note' + access+req.body.noteId+ '">playverse-notes</a></p></div>'
        // plain text body
      });}};
      const note = await noteModel.findOne({include:{model:userModel,attributes:["name","email","photo"]},where:{id:req.body.noteId}})
    res.json({
        status:"success",
        data:note
    })
})

export const generateOtp = catchAsync(async(req,res,next)=>{
  const otpNo = Math.floor(Math.random()*90000) + 10000;
  const user = await userModel.findByPk(req.body.email);
  if(!user){
    return res.status(400).json({
      status:"failure",
      message:"user doesn't exists"
    })
  }
  const otp = await otpModel.findOne({where:{emailId:req.body.email}});
  if(otp){
      otp.update({otp:otpNo});
  }
  else{
      otpModel.create({otp:otpNo,emailId:req.body.email});
  }
  // console.log(otpNo);
  let transporter =nodemailer.createTransport({
    host: "smtp.office365.com",
    port:587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  let info = transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: req.body.email, // list of receivers
    subject: `Enter the Otp to reset your password`, // Subject line
    text: `${user.name} enter the following otp to change your password ${otpNo}  `, // plain text body
  });
  res.status(200).json({
    status:"success"
  })
})

