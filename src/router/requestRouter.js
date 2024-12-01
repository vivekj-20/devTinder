const express = require("express");
const user = require("../model/user");

const requestRouter = express.Router();


requestRouter.get("/feed",async (req,res)=>{
    try{
        const users = await user.find({}); 
        res.send(users);
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})

module.exports = {requestRouter};