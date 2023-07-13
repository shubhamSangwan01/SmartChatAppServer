import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import cors from 'cors'

const app = express();
app.use(cors())
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})
io.on("connection",(socket)=>{
    console.log("User Connected to socket "+socket.id)

     socket.on("join_room",(id)=>{
         console.log("User "+socket.id +" successfully joined room with Id "+id )
         socket.join(id)
     }) 

    socket.on("send_message",(data)=>{
        socket.to("123").emit("receive_message",data)
        console.log("Message send from backend")
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected: "+socket.id)
     })
    
})

server.listen(4000,()=>{
    console.log('Server running at port '+4000)
})

