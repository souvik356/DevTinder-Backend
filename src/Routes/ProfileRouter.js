const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { User } = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    res.json({
      data:loggedInUser,
      message : 'profile',
      success : true,
      error : false
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    // console.log(loggedInUser._id);

    const dataToBeUpdated = req.body;
    const {firstName,lastName,photoURL,about,gender,skills,age} = req.body
    // console.log(dataToBeUpdated);

    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoURL",
      "about",
      "gender",
      "skills",
      "age",
    ];

    const isAllowed_updates = Object.keys(dataToBeUpdated).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isAllowed_updates) {
      throw new Error("Updates not allowed");
    }
    if(!["male","female","others"].includes(gender)){
       return res.status(400).json({
        message : "invalid gender",
        success : false,
        error  : true
       })
    }
    if(age < 16){
      return res.status(400).json({
        message : "Age below 16 years are not allowed",
        success : false,
        error  : true
      })
    }

    const user = await User.findByIdAndUpdate(
      { _id: loggedInUser._id },
      dataToBeUpdated,
      { new: true, runValidators: true }
    );

    return res.json({
      message: `${user.firstName}'s data is updated `,
      data : user,
      success : true,
      error : false
    });
  } catch (err) {
    return res.status(500).json({
    message : err.message || err,
    success : false,
    error: true
    });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = req.body;
    const ALLOWED_UPDATES = ["password"];
    const isPasswordUpdatesAlloowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isPasswordUpdatesAlloowed) {
      throw new Error("password update not allowed");
    }
    const { password } = data;
    // console.log(password);
    if (!validator.isStrongPassword(password)) {
      throw new Error("please make your password strong");
    }
    const checkOldPasswordEqualToNewPassword = await bcrypt.compare(
      password,
      loggedInUser.password
    );
    if (!checkOldPasswordEqualToNewPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(hashedPassword);
      // old password = $2b$10$q7CRAF5S9ENVP98E.W2GiOSWfNn3cbtEc/XPza8aCY1kLln0nJTom
      const user = await User.findByIdAndUpdate(loggedInUser._id, {
        password: hashedPassword,
      });

      res.json({
        message: "password is updated successfully",
        user,
      });
    }
    else{
        res.json({
            message: 'Please provide new password'
        })
    }
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

module.exports = { profileRouter };
