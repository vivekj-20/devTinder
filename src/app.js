const express = require("express");
const connectDB = require("./config/database");
const user = require("./model/user");

const app = express();


app.post("/signup",async (req,res)=>{
    const dummy = new user({
        firstName:"vivek",
        lastName:"jena",
        emailId:"vivek@jena.com",
        age:"24",
        gender:"M",
    })
    try{
       await dummy.save();
       res.send({result:"successfully added data of new user in DB !!!"});
    }
    catch(err){
       res.status(400).send({result:"something went wrong :( .. error in adding data to DB" + err.message});
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