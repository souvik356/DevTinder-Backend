const express = require('express')
const { Chat } = require('../models/Chat')
const { userAuth } = require('../middleware/userAuth')

const chatRouter = express.Router()

chatRouter.get('/chat/:targetUserId',userAuth, async (req,res) => {
    try {
        const userId = req.user._id
        const { targetUserId } = req.params
        let chat = await Chat.findOne({
            participants: { $all: [userId,targetUserId]},
        }).populate({
            path:'messages.senderId',
            select:'firstName lastName'
        })
        if(!chat) {
            chat = new Chat({
                participants:[userId,targetUserId],
                messages: []
            })
            await chat.save()
        }
        return res.json(chat)
    } catch (error) {
        return res.status(500).json({
            message  : error.message || error,
            success : false,
            error : true
        })
    }
})

module.exports = { chatRouter }