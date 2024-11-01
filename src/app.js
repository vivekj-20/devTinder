const express = require("express");
const { userInfo } = require("os");

const app = express();

app.get("/user/:userId/:name",(req,res,next)=>{
    res.send({firstName:"vivek",lastName:"jena",userInfo:req.params.userId,name:req.params.name});
    next();
},(req,res,next)=>{
    //res.send("welcome home 1");
    next();
},(req,res,next)=>{
    //res.send("welcome home 2");
    next();
},
(req,res)=>{
    res.send("welcome home 3");
    //next();
})

app.post("/ho*m+e",(req,res)=>{
    res.send("welcome home");
})

app.use("/tes?t",(req,res)=>{
    res.send("Test my knowledge here");
})

app.use(/.*none$/,(req,res)=>{
    res.send("Test my knowledge here gojo");
})

app.use("/",(req,res)=>{
    res.send("hellooooooo");
})

app.listen(7777,()=>{
    console.log("Server is up , Please send your request");
});