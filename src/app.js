const express = require("express");

const app = express();

app.use("/myPage",(req,res)=>{
    res.send("Hello Everyone , Welcome to Namaste NodeJS");
})

app.use("/home",(req,res)=>{
    res.send("welcome home");
})

app.use("/test",(req,res)=>{
    res.send("Test my knowledge here");
})

app.listen(7777,()=>{
    console.log("Server is up , Please send your request");
});