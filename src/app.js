const express = require("express");
const connectDB = require("./config/database");
const user = require("./model/user");

const app = express();

app.use(express.json());

app.post("/signup",async (req,res)=>{
    const dummy = new user(req.body)
    const data = req.body;
    try{
        if(data?.skills.length > 10){
            throw new Error(" No one can have more than 10 skills");
        }
       await dummy.save();
       res.send({result:"successfully added data of new user in DB !!!"});
    }
    catch(err){
       res.status(400).send({result:"something went wrong :( .. error in adding data to DB" + err.message});
    }
})

app.get("/user",async (req,res)=>{
    try{
       const users = await user.find({emailId:req.body.emailId}); 
       res.send(users);
    }
    catch(err){
       res.status(404).send({result:"data not found" + err.message});
    }
})

app.delete("/user",async (req,res)=>{
    const Id = req.body.userId;
    try{
        const users = await user.findByIdAndDelete(Id);
        res.send({result:"successfully deleted data from DB !!!"});
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})

app.delete("/user/name",async (req,res)=>{
    const name = req.body.firstName;
    try{
        const users = await user.deleteOne({firstName:name});
        res.send({result:"successfully deleted data from DB !!!"});
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})


app.patch("/user/:userId",async (req,res)=>{
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

app.get("/feed",async (req,res)=>{
    try{
        const users = await user.find({}); 
        res.send(users);
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
})
connectDB().then(()=>{
    console.log("DB connected successfully !!!")
    app.listen(7777,()=>{
        console.log("Server is up , Please send your request");
    });
}).catch((err)=>{
    console.error("cannot connect to DB");
});