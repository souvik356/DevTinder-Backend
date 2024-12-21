const express = require('express')
const { User } = require('../models/User')
const { Validation } = require('../utils/Validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/signup',async(req,res)=>{
   try{
      const data = req.body
      Validation(data)
      const { firstName,lastName,emailID,password } = data
      const IS_EMAILID_IN_DB = await User.findOne({"emailID" : emailID})
      if(IS_EMAILID_IN_DB){
        res.json({
            message: `${IS_EMAILID_IN_DB.emailID} is already registered`
        })
      }
      const hashedPassword = await bcrypt.hash(password,10)
      const user = new User({
         firstName,
         lastName,
         emailID,
         password: hashedPassword
      })
       await user.save()
       res.json({
        message:"user is registered in DevTinder",
        user
       })
   }catch(err){
    res.status(400).send('user cannot be registered ' + err.message)
   }
})

authRouter.post('/login',async (req,res) => {
    try{
        const data = req.body
        const {emailID,password} = data
        // console.log(emailID);
        // console.log(password);
        
        const user = await User.findOne({emailID: emailID})
        // console.log(user);
        
        if(!user){
            throw new Error("Invalid Email address")
        }
        // console.log(user.password);
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
            const jwtToken = jwt.sign({_id: user._id},'DevTinder@123')
            // console.log(jwtToken);
            res.cookie("token",jwtToken,{
                expiresIn: '7d'
            })
            res.send("logged in successful")
        }
        else{
            res.status(400).send("Invalid password")
        }
    }catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

authRouter.post('/logout',async(req,res)=>{
   res.cookie("token",null,{
    expiresIn: '0h'
   })
   res.send('logout successfull')
})

module.exports = { authRouter }