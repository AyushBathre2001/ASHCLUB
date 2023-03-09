const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()


//accessing or creating one on one chat
router.post('/access',fetchuser,async(req,res)=>{
    const {userId} = req.body
    const ourId = req.user
    if(!userId){
        res.status(400).send("UserId not sent with the request")
    }

    let isChat = Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:ourId}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    })
    .populate("users","-password")
    .populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }
    else{
        let chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[ourId,userId]
        }

        try {
            const newChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id:newChat._id}).populate(
                "users",
                "-password"
            )

            res.status(200).send(fullChat)
        } catch (error) {
            res.send(error)
        }
    }

})


//fetching all chats
router.get('/fetch',fetchuser,async(req,res)=>{
    try {
        const ourId = req.user
        Chat.find({users:{$elemMatch:{$eq:ourId}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updateAt:-1})
        .then(async(results)=>{
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })
            res.status(200).send(results)
        })
    } catch (error) {
        res.send(error)
    }
})

//creating a group chat
router.post('/group/create',fetchuser,async(req,res)=>{
    let users = JSON.parse(req.body.users)
    users.push(req.user)
    if(users.length <2){
        return res.status(400).send("More than 2 users are required to form a group chat")

    }

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.send(error)
    }
})

//renaming a group
router.put('/group/rename',fetchuser,async(req,res)=>{
    const {chatId,chatName} = req.body
    const updateName = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!updateName){
        res.status(404)
    }
    else{
        res.json(updateName)
    }
})

//adding a user in the group
router.put('/group/adduser',async(req,res)=>{
    const {chatId,userId} = req.body

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId} 
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!added){
        res.status(404)
    }
    else{
        res.json(added)
    }
})

//removing a user from the group
router.put('/group/removeuser',async(req,res)=>{
    const {chatId,userId} = req.body

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId} 
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(404)
    }
    else{
        res.json(removed)
    }
})

module.exports = router