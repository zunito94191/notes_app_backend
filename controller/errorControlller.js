import AppError from "../utils/appError.js";

const SendErrorDev =(err,res) =>{
    res.status(err.statusCode).json({
        status:err.status,
        err:err,
        message:err.message,
        stack : err.stack
    });
}
const SendErrorProd =(err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    }else{
        res.status(500).json({
            status:"error",
            message:"Something went wrong"
        })
    }
}
const handleCastErrorDB = err =>{
    
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message,400);
}
const handleDuplicateErrorDB = err =>{
    console.log(err)
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate  field value: ${value}. Please use another value`
    return new AppError(message,400);
}
const handleValidationErrorDB = err =>{
    const error = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${error.join('. ')}`
    return new AppError(message,400);
}
const handleJsonWebTokenError = err =>{
    return new AppError("Invalid token. Please try again!",401)
}
const handleExpiredWebToken = err => new AppError("Your token has expired! Please log in again", 401);
export default function globalErrorHandler(err,req,res,next){
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === "production"){
        SendErrorDev(err,res);
    }else if(process.env.NODE_ENV=== "development"){
        let error = {...err};
        if(err.name==='CastError') error = handleCastErrorDB(error)
        if(err.code===11000) error = handleDuplicateErrorDB(error)
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error)
        if(err.name === "JsonWebTokenError") error = handleJsonWebTokenError(error)
        if(err.name === "TokenExpiredError") error = handleExpiredWebToken(error)
        SendErrorProd(error,res);
    }
    
}