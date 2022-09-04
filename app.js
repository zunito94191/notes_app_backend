import express from "express";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import helmet from "helmet";
import sequelize from "./model/index.js";
import {fileURLToPath} from "url";
import noteRouter from "./routes/notesRouter.js";
import emailRouter from "./routes/emailRouter.js";
import globalErrorHandler from "./controller/errorControlller.js";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors({
    origin:'*'
}))
app.use(express.static(path.join(__dirname,"../note-app/build")))
app.use(express.json());
app.use(helmet());
app.use("/v1/api/user",userRouter);
app.use("/v1/api/note",noteRouter);;
app.use("/v1/api/email",emailRouter);
app.use(globalErrorHandler);
export default app;