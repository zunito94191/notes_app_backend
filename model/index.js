import noteModel from "./noteModel.js";
import userModel from "./userModel.js";
import sequilize from "../utils/database.js";
import collabModel from "./collabModel.js";
import otpModel from "./otpModel.js";


userModel.hasMany(noteModel,{foreignKey:'emailId'});
noteModel.belongsToMany(userModel,{through:collabModel});
userModel.belongsToMany(noteModel,{through:collabModel});

try{
    await sequilize.sync();
    console.log("Connected to database")
}catch(error){
    console.log("unable to connect he database",error)
}

export default sequilize;

