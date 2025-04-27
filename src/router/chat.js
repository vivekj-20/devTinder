const express = require('express');
const { Chat } = require('../model/chat');
const auth = require('../middleware/auth');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', auth ,async (req, res) => {
  const {targetUserId } = req.params;
  const userId = req.data._id;

  try {
    let chat = await Chat.findOne({participants: {$all: [userId, targetUserId]}}).populate({path: 'messages.senderId', select: 'firstName lastName'});
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
        await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
})

module.exports = {chatRouter};