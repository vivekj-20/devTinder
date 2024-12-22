const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");

const USER_SAFE_DATA = ["firstName","lastName","age","gender","skills","status"];

userRouter.get("/user/requests/received",auth,async(req,res) => {
    try{
        const loggedInUser = req.data;
        const request = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({
            message: "Data fetched successfully",
            data:request,
        }); 
    }catch(err){
      req.statusCode(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", auth, async (req, res) => {

    try{
        const loggedInUser = req.data;

        const request = await ConnectionRequest.find({
          $or: [
            { toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" },
          ],
        })
          .populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);
    
        const data = request.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
              return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            message: "Data fetched successfully",
            data:data
        });  
    }catch(err){
     res.status(400).send({ message: err.message });
    }
});

module.exports = {userRouter};