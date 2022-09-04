import express from "express";
import * as notesController from "../controller/notesController.js";
import {protect} from "../controller/authController.js";
const noteRouter = express.Router();

noteRouter.get("/getnotesbyuserid",protect,notesController.getNotesByUserId);
noteRouter.post("/addnote",protect,notesController.createNotes)
noteRouter.patch("/patchnote",protect,notesController.patchNotes)
noteRouter.post("/deletenote",protect,notesController.deleteNotesById);
noteRouter.get("/getnotebyid/:id",protect,notesController.getNoteById)

export default noteRouter;