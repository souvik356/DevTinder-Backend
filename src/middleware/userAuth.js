const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

const userAuth =async(req,res,next)=>{
   try{
        const cookie = req.cookies
      //   console.log(cookie);
        const { token } = cookie
        if(!token){
          return res.status(401).json({
            message : 'please login'
          })
        }
      //   console.log(token);
        const decodeMessage = jwt.verify(token,'DevTinder@123')
      //   console.log(decodeMessage);
        const { _id } = decodeMessage
      //   console.log(_id);
        
        const user = await User.findById({"_id" : _id})
      //   console.log(user);
        
        req.user = user
        
        next()
        
   }catch(err){
    res.status(400).send(`ERROR : ${err.message}`)
   }
}

module.exports ={ userAuth }