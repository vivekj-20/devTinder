const bcrypt = require("bcrypt");
const {validateData} = require("../utils/validate");
const express = require("express");
const authRouter = express.Router();
const user = require("../model/user");

authRouter.post("/login",async (req,res)=>{
    const data = req.body;

    try{
        const{emailId,password} = data;

    const User = await user.findOne({emailId:emailId});

    if(!User){
        throw new Error("Invalid credentials");
    }

    const isCorrectPass = await User.PasswordCheck(password);

    if(isCorrectPass){

        const token = await User.getJWT();

        res.cookie("token",token,{ expires: new Date(Date.now() + 7 * 3600000), httpOnly: true }); // for 7 day only
        res.send({result:User});
    }
    else{
       res.status(401).send({result:"Invalid credentials"});
    }
  } catch (err){
    res.status(401).send({result:"something went wrong : " + err.message});
  }
})

authRouter.post("/signup",async (req,res)=>{
    const data = req.body;
    try{
        // validate our data
        validateData(req);

        const {firstName,lastName,password,emailId} = data;

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const User = new user({
            firstName,
            lastName,
            emailId,
            password:hashedPassword
        });

        if(data?.skills?.length > 10){
            throw new Error(" No one can have more than 10 skills");
        }

        const token = await User.getJWT();

        res.cookie("token",token,{ expires: new Date(Date.now() + 7 * 3600000), httpOnly: true }); // for 7 day only
        await User.save();
        res.json({result:"successfully added data of new user in DB !!!",data:User});
    }
    catch(err){
       res.status(400).send({result:"something went wrong :( .. error in adding data to DB" + err.message});
    }
})

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send({result:"user logged out!!!"});
})

module.exports = {authRouter};