const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const Chat = require('../models/chatModel')
const Message = require('../models/messageModel')
const User = require('../models/userModel')

const router = express.Router()

router.post('/send',fetchuser, async(req,res)=>{
     const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user,
    content: content,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);
  
    await message.populate("sender", "name pic");
    await message.populate("chat");
    await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
  
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error creating message");
  }
  
})


router.get('/fetch/:chatId',fetchuser,async(req,res)=>{
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})

module.exports = router