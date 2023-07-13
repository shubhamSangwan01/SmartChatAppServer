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

    socket.on("send_message",(data)=>{
        socket.broadcast.emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected: "+socket.id)
     })
    
})

server.listen(4000,()=>{
    console.log('Server running at port '+4000)
})

