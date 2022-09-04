import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const userModel = sequelize.define("user",{
    name: {
        type:DataTypes.TEXT,
        allowNull:false},
    email:{
        primaryKey:true,
        type:DataTypes.STRING,
        allowNull:false},
    photo:DataTypes.TEXT,
    password:DataTypes.TEXT,
    },
)

export default userModel;