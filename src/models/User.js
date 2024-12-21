const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 25
    },
    lastName:{
        type: String,
        required: true,
        trim:true,
        maxLength: 25
    },
    emailID:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email address is not valid")
            }
        },
        trim: true
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is not strong')
            }
        },
        trim: true
    },
    photoURL:{
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('URL is not valid')
            }
        }
    },
    about:{
        type: String,
        maxLength: 60
    },
    age:{
        type: Number,
        validate(value){
            if(!value >= 16){
               throw new Error('Age must be greater than 16')
            }
        }
    },
    gender:{
        type: String,
        enum:{
            values:["male","female","others"],
            message: '`{VALUE}` is not supported'
        }
    },
    skills:{
        type: [String],
        validate(value){
            if(value.length > 10){
                throw new Error('Skills count should be less than 10')
            }
        }
    }
},{
    timestamps: true
})

const User = mongoose.model("User",userSchema)

module.exports = { User }