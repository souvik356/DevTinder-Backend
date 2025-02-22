const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const { ConnectionRequest } = require('../models/Connection')
const { User } = require('../models/User')
const { set } = require('mongoose')
const userRouter = express.Router()

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user
        // console.log(loggedInUser._id);
        
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id,status: "accepted"}
            ]
        }).populate("fromUserId","firstName lastName photoURL about age gender").populate("toUserId","firstName lastName photoURL about age gender")

        // console.log(connections);
        const connectionData = connections.map((data)=>{
            if(loggedInUser._id.toString() === data.fromUserId._id.toString()){
                return data.toUserId
            }
            else{
                return data.fromUserId
            }
        })
        res.json({
            message:"All your connections are below",
            data :connectionData
        })
    }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

userRouter.get('/user/request',userAuth,async(req,res)=>{
     try{
        const loggedInUser = req.user

        const connections = await ConnectionRequest.find({
            toUserId: loggedInUser._id, status: "interested"
        }).populate("fromUserId","firstName lastName photoURL about age gender")
        //  const connectionRequest = connections.map((data)=>{
        //     if(loggedInUser._id.equals(data.toUserId._id)){
        //         return data.fromUserId
        //     }
        //  })
         res.json({
            message:"All connections requests are :- ",
           connections
         })
     }catch(err){
        res.status(400).status(`ERROR : ${err.message}`)
     }
})

userRouter.get('/user/feed',userAuth,async(req,res)=>{
     try{
         const loggedInUser = req.user
         const connectionRequest = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
         }).select("fromUserId toUserId")
        //  console.log(connectionRequest);
        //  const data = connectionRequest.map((data)=>{
        //      if(loggedInUser._id.equals(data.fromUserId)){
        //         return data.toUserId.toString()
        //      }
        //      return data.fromUserId.toString()
        //  })

        const hideFromFeed = new Set()
        connectionRequest.forEach((req)=>{
           hideFromFeed.add(req.fromUserId.toString())
           hideFromFeed.add(req.toUserId.toString())
        })
        //  console.log(hideFromFeed);
        //  console.log(data);
         

         const users = await User.find({
            $and:[
                { _id: {$nin: Array.from(hideFromFeed)}},
                { _id: {$ne: loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl age gender about skills")
        res.send(users)

     }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
     }
})

module.exports = { userRouter }