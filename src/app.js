const express = require("express");
const connectDB = require("./config/database");
const cookie = require("cookie-parser");
const { authRouter } = require("./router/authRouter");
const { profileRouter } = require("./router/profileRouter");
const { requestRouter } = require("./router/requestRouter");

const app = express();

app.use(express.json());
app.use(cookie());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(()=>{
    console.log("DB connected successfully !!!")
    app.listen(7777,()=>{
        console.log("Server is up , Please send your request");
    });
}).catch((err)=>{
    console.error("cannot connect to DB");
});