const express = require("express");
const profileRouter = express.Router();
const user = require("../model/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

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

profileRouter.patch("/profile/edit", auth, async (req, res) => {
    try {
      // Validate allowed fields to update
      const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
      ];
  
      const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
      );
  
      if (!isEditAllowed) {
        throw new Error("Invalid Edit Request");
      }
  
      // Find the logged-in user based on the data from auth middleware
      const loggedInUser = await user.findById(req.data._id);  // Find user by ID from the decoded token
  
      if (!loggedInUser) {
        return res.status(404).send({ result: "User not found" });
      }
  
      // Update the user's profile with the fields provided in the request body
      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });
      // Save the updated user back to the database
      await loggedInUser.save();
  
      res.json({
        message: `${loggedInUser.firstName}, your profile was updated successfully`,
        payload: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

  profileRouter.patch("/user/password/:userId",async (req,res)=>{
    const Id = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATE = ["password"];

        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATE.includes(k));

        if(!isUpdateAllowed){
           throw new Error(": update not allowed for some specific fields");  
        }
        if(data.password != null){
            hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
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