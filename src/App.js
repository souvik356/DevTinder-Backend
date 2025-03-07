const express = require("express");
const cookieParser = require('cookie-parser')
const { connectDb } = require("./utils/Database");
const {initializeSocket} = require('./utils/Socket')
const cors = require('cors')
const http = require('http')

const app = express();  

const corsOption = {
  origin : 'http://localhost:5173',
  credentials : true
}

app.use(cors(corsOption))
app.use(express.json())
app.use(cookieParser())


const server = http.createServer(app)

initializeSocket(server)

const { authRouter } = require('./Routes/AuthRouter')
const { profileRouter } = require('./Routes/ProfileRouter')
const { connectionRouter } = require('./Routes/connectionRouter')
const { userRouter } = require('./Routes/userRouter');
const { chatRouter } = require("./Routes/chatRouter");

app.use('/',authRouter)
app.use('/', profileRouter)
app.use('/',connectionRouter)
app.use('/',userRouter)
app.use('/',chatRouter)

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(7777, () => {
      console.log("server is lisetening to port number 7777");
    });
  })
  .catch((err) => {
    console.log(`Database connection unsuccessfull ${err.message}`);
  });
