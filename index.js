require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const PORT = process.env.PORT || 5000
const dbConnect = require('./db')
dbConnect()


const app = express()
app.use(express.json())
app.use(cors())
app.use(fileupload({
    useTempFiles:true
}))

app.use('/user',require('./routes/authentication'))
app.use('/chat',require('./routes/chatRoutes'))
app.use('/message',require('./routes/messageRoutes'))

const server = app.listen(PORT,()=>{
    console.log("Server is running on port:", PORT)
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("Connected to socket.io")

    socket.on("setup", (user)=>{
        socket.join(user._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room) =>{
        socket.join(room)
        console.log("user joined room: ",room)
    })

    socket.on("new message",(newMessage)=>{
        var chat = newMessage.chat
        if(!chat.users) return console.log("chat.users not defined")

        chat.users.forEach((user)=>{
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessage)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(user._id);
      });
})