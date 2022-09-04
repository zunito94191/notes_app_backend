import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const sequelize = new Sequelize("playverse", "root", "zunito123", {
  host: process.env.HOST,
  dialect: "mysql",
  dialectOptions: {
    connectionTimeout: 100000,
  },
  pool: {
    max: 25,
    min: 0,
    idle: 10000,
  },
});

export default sequelize;
