import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
const collabModel = sequelize.define("collab",{
    role:{
        type:DataTypes.ENUM('editor','viewer')
    }
})

export default collabModel;