const express = require("express");
const user = require("../model/user");
const connectionRequest = require("../model/connectionRequest");
const auth = require("../middleware/auth");
const requestRouter = express.Router();


requestRouter.get("/feed",async (req,res)=>{
    try{
        const users = await user.find({}); 
        res.send(users);
    }
    catch(err){
        res.status(404).send({result:"data not found" + err.message});
    }
});

requestRouter.post("/request/send/:status/:toUserId",auth,async(req,res)=>{
    try{

      const toUserId = req.params.toUserId;
      const fromUserId = req.data._id;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await connectionRequest.findOne({
        $or:[
           {toUserId,fromUserId},
           {toUserId: fromUserId , fromUserId : toUserId}, 
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message:
          req.data.firstName + " " + status + " " + toUser.firstName,
        data,
      });

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",auth,async(req,res)=>{
     try{
        const requestId = req.params.requestId;
        const status = req.params.status;
        const loggedInUser = req.data;

        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
           return res
            .status(400)
            .json({ message: "Invalid status type: " + status });  
        }

        console.log(loggedInUser._id);
        console.log(requestId);

        const connectionRequeststatus = await connectionRequest.findOne({
            status:"interested",
            toUserId:loggedInUser._id,
            _id:requestId
        })
        
        connectionRequeststatus.status = status

        const data = await connectionRequeststatus.save();

        res.json({
            message:"connection status is " + status,
            data,
          });
     }catch(err){
        res.status(400).send("ERROR: " + err.message);
     }
});

module.exports = {requestRouter};