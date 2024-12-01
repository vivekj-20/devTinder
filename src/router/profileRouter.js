const express = require("express");
const profileRouter = express.Router();
const user = require("../model/user");
const auth = require("../middleware/auth");

profileRouter.get("/profile",auth, async(req,res)=>{

    const data = req.data;

    try{
        res.send(data);
    } 
    catch (err){
    res.status(400).send({result:"something went wrong : " + err.message});
  }
});

profileRouter.get("/user",async (req,res)=>{
    try{
       const users = await user.find({emailId:req.body.emailId}); 
       res.send(users);
    }
    catch(err){
       res.status(404).send({result:"data not found" + err.message});
    }
})

profileRouter.delete("/user",async (req,res)=>{
    const Id = req.body.userId;
    try{
        const users = await user.findByIdAndDelete(Id);
        res.send({result:"successfully deleted data from DB !!!"});
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})

profileRouter.delete("/user/name",async (req,res)=>{
    const name = req.body.firstName;
    try{
        const users = await user.deleteOne({firstName:name});
        res.send({result:"successfully deleted data from DB !!!"});
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})

profileRouter.patch("/user/:userId",async (req,res)=>{
    const Id = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATE = ["firstName","lastName","password","gender","skills"];

        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATE.includes(k));

        if(!isUpdateAllowed){
           throw new Error(": update not allowed for some specific fields");  
        }

        if(data?.skills?.length > 10){
            throw new Error("no one can have more than 10 skills");
        }
        await user.findByIdAndUpdate(Id,data,{
                runValidators:true // to run validate function and check data values on update
            });
        res.send({result:"successfully updated data in the DB !!!"});
    }
    catch(err){
        res.status(400).send({result:"failed to update data " + err.message});
    }
})

module.exports = {profileRouter};