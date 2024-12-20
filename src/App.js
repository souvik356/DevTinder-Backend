const express = require("express");
const cookieParser = require('cookie-parser')
const { connectDb } = require("./utils/Database");
const app = express();

app.use(express.json())
app.use(cookieParser())

const { authRouter } = require('./Routes/AuthRouter')
const { profileRouter } = require('./Routes/ProfileRouter')

app.use('/',authRouter)
app.use('/', profileRouter)

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("server is lisetening to port number 7777");
    });
  })
  .catch((err) => {
    console.log(`Database connection unsuccessfull ${err.message}`);
  });
