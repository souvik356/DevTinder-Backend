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
       return res.json({
        message:"user is registered in DevTinder",
        user,
        success : true,
        error : false
       })
   }catch(err){
    return res.status(500).json({
        message : err,
        success : false,
        error : true
    })
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
            return res.status(400).json({
                message :"Invalid email",
                success: false,
                error : true
            })
        }
        // console.log(user.password);
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
            const jwtToken = jwt.sign({_id: user._id},'DevTinder@123')
            // console.log(jwtToken);
            res.cookie("token",jwtToken,{
                expiresIn: '7d'
            })
           return res.json({
                message : 'Logged in successfull',
                data : user,
                success : true,
                error: false
            })
        }
        else{
            return res.status(400).json({
                message :"Invalid password",
                success: false,
                error : true
            })
        }
    }catch(error){
        return res.status(500).json({
            message : error.message || error,
            success: false,
            error : true
        })
    }
})

authRouter.post('/logout',async(req,res)=>{
   res.cookie("token",null,{
    expires: new Date(Date.now())
   })
   return res.json({
    message : 'logout successfull',
    success : true,
    error : false
   })
})

module.exports = { authRouter }