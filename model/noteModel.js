import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const noteModel = sequelize.define("note",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    body:DataTypes.TEXT,

})

export default noteModel;