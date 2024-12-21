const mongoose = require('mongoose')

const connectionSchema = mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    status: {
        type: String,
        validate(value){
            if(!["interested","ignored","accepted","rejected"].includes(value)){
               throw new Error("Status is not valid")
            }
        }
    }
},{
    timeStamps: true
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionSchema)

module.exports = { ConnectionRequest }