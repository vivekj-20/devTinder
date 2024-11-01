const { throws } = require("assert");
const express = require("express");
const { userInfo } = require("os");
const {auth,adminAuth} = require("./middleware/auth");

const app = express();

// authorization of user in this middleware
app.use("/user", auth);

app.get("/user/:userId/:name",(req,res)=>{

    try{
          res.send({firstName:"vivek",lastName:"jena",userInfo:req.params.userId,name:req.params.name});

          //throw new Error("server error"); for testing error scenario
    }
    catch(err){
        res.status(401).send({handeledErrorMessage:"something went wrong",error:err.message});
    }
})

app.get("/user/host",(req,res)=>{

    try{
          res.send({firstName:"vivek",lastName:"jena",host:"none"});

          //throw new Error("server error"); for testing error scenario
    }
    catch(err){
        res.status(401).send({handeledErrorMessage:"something went wrong",error:err.message});
    }
})

// admin auth is passed as a new param in app.get to authenticate the admin
app.get("/admin",adminAuth,(req,res)=>{
    res.send({firstName:"vivek",lastName:"jena",auth:"no user auth will work on me!!! ..... I am the Admin"});
})

// should always follow the order err,req,res,next
app.use("/",(err,req,res,next)=>{
   if(err){
    res.status(500).send({unhandeledErrorMessage:"something went wrong"});
   }
});

app.listen(7777,()=>{
    console.log("Server is up , Please send your request");
});