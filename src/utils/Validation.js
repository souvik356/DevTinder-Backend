const validator = require('validator')
const Validation = (data)=>{
   const {firstName,lastName,emailID,password} = data
   if(!firstName || !lastName){
    throw new Error("Please fill your first and last name")
   }
   else if(!validator.isEmail(emailID)){
    throw new Error("Email address is not valid")
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("Please make the password strong")
   }
}

module.exports = { Validation }