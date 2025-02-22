const express = require('express')
const { ConnectionRequest } = require('../models/Connection')
const { userAuth } = require('../middleware/userAuth')
const { User } = require('../models/User')

const connectionRouter = express.Router()

connectionRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    try{
        const status = req.params.status
        const userId = req.params.userId // userId to whom request is supposed to send
        const loggedInUser = req.user
        const fromUserId = loggedInUser._id
    
        if(!["interested","ignored"].includes(status)){
            throw new Error("Status is not valid")
        }
       
        const toUser = await User.findById(userId)
        
        if(!toUser){
            throw new Error("user not found hence request can't be sent")
        }

        const toUserId = toUser._id

        const isConnectionValid = await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:loggedInUser._id}]
        })

        if(isConnectionValid){
            throw new Error('connection request already exist')
        }
        
        if(loggedInUser._id.equals(toUser._id)){
            throw new Error("You can't send request to yourself")
        }
        
        const connectionRequest = new ConnectionRequest({
            fromUserId : loggedInUser._id,
            toUserId: toUser._id,
            status: status
        })
        
         const data = await connectionRequest.save()

         res.json({
            message: `${loggedInUser.firstName} is ${status} in ${toUser.firstName}`,
            data
         })

    }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})


connectionRouter.patch('/request/review/:status/:requestId',userAuth,async(req,res)=>{
     try{
        const loggedInUser = req.user
        const status = req.params.status
        const requestId = req.params.requestId
   
        if(!["accepted","rejected"].includes(status)){
           throw new Error("Status is not valid")
        }

        const isConnectionRequestValid = await ConnectionRequest.findOne({"_id":requestId,"toUserId":loggedInUser._id,status:"interested"})
        if(!isConnectionRequestValid){
            throw new Error("requestId is not valid")
        }

        const connectionRequest = await ConnectionRequest.findByIdAndUpdate({"_id": requestId},{"status": status}, { runValidators : true})

        res.json({
            message: `Connection request ${status}`,
            data: connectionRequest,
            success : true,
            error : false
        })

     }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
     }
})

module.exports = { connectionRouter }