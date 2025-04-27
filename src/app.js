const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");
const { authRouter } = require("./router/authRouter");
const { profileRouter } = require("./router/profileRouter");
const { requestRouter } = require("./router/requestRouter");
const { userRouter } = require("./router/userRouter");
const http = require("http");
const cors = require('cors');
const initializeSocket = require("./utils/socket");
const { chatRouter } = require("./router/chat");
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use("/",authRouter);
app.use("/",profileRouter); 
app.use("/",requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


// for implementing socket io with express
const server = http.createServer(app);

initializeSocket(server);

connectDB().then(()=>{
    console.log("DB connected successfully !!!")
    server.listen(process.env.PORT,()=>{
        console.log("Server is up , Please send your request");
    });
}).catch((err)=>{
    console.error("cannot connect to DB");
});