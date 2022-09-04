import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const otpModel = sequelize.define("otp",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    otp:{
        type:DataTypes.INTEGER,
    },
    emailId:{
        type:DataTypes.TEXT
    }
})

export default otpModel;