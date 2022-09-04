import noteModel from "../model/noteModel.js";
import userModel from "../model/userModel.js";
import catchAsync from "../utils/catchAsync.js";
export const getNotesByUserId =catchAsync(async (req,res,next) =>{
    const allNotes = await noteModel.findAll({include:{model:userModel,attributes:["name","email","photo"]},where:{emailId:req.user.email}})
    res.json({
        status:"success",
        data:allNotes
    })
});

export const deleteNotesById = catchAsync(async(req,res,next)=>{

    const deletedNote = await noteModel.destroy({
        where:{
            id:req.body.noteId
        }
    });
    res.status(200).json({
        status:"success",
        message:"Note Deleted"
    })

})

export const getNoteById = catchAsync(async(req,res,next)=>{

    const note = await noteModel.findByPk(req.params.id,{include:userModel});
    res.status(200).json({
        status:"success",
        data:note
    })

})
export const createNotes = catchAsync(async(req,res,next)=>{
    const newNote = await noteModel.create({emailId:req.user.email,title:"Untitled",body:""});
    res.status(200).json({
        status:"success",
        data:newNote
    })
})

export const patchNotes = catchAsync(async(req,res,next)=>{
    const {id,...patchNote} = req.body;
    const patchedNotes = await noteModel.update(patchNote,{
        where:{
            id
        }
    });

    res.status(200).json({
        status:"success"     
    })

})