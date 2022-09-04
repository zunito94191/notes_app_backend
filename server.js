import httpServer from "./app.js";
const port = process.env.PORT || 8080; 


httpServer.listen(port,()=>console.log(`Server is running on ${port}`));