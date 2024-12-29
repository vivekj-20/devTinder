const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");
const { authRouter } = require("./router/authRouter");
const { profileRouter } = require("./router/profileRouter");
const { requestRouter } = require("./router/requestRouter");
const { userRouter } = require("./router/userRouter");
const cors = require('cors')


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


connectDB().then(()=>{
    console.log("DB connected successfully !!!")
    app.listen(7777,()=>{
        console.log("Server is up , Please send your request");
    });
}).catch((err)=>{
    console.error("cannot connect to DB");
});