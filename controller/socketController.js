import { io } from "../app";
import {promisify} from "util";

io.use((socket,next)=>{
    if(isValid(socket.request)){
        socket.email = (await promisify(jwt.verify)(socket.handshake.auth.token,process.env.JWT_SECRET)).email
        next();
    }else{
        next(new Error("invalid"))
    }
})

io.on("connection",(socket)=>{
    var email = socket.email;
    var documentId = socket.document

})