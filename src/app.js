const express = require("express");
const connectDB = require("./config/database");
const user = require("./model/user");

const app = express();

app.use(express.json());

app.post("/signup",async (req,res)=>{
    const dummy = new user(req.body)
    try{
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

app.patch("/user",async (req,res)=>{
    const Id = req.body.userId;
    const data = req.body;
    try{
        const users = await user.findByIdAndUpdate(Id,data);
        res.send({result:"successfully updated data in the DB !!!"});
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
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