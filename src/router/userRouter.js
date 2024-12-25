const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const user = require("../model/user");

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

userRouter.get("/feed", auth, async (req, res) => {

    try{

        const loggedInUser = req.data;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        const requests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
          }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set(); // using a set data structure to avoid duplicate user id's values from DB.
            
        requests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        
        const users = await user.find({
            $and: [
              { _id: { $nin: Array.from(hideUsersFromFeed) } },
              { _id: { $ne: loggedInUser._id } },
            ],
          }).select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);

        res.json({
            message: "Data fetched successfully",
            data:users
        });  
    }catch(err){
     res.status(400).send({ message: err.message });
    }
});


module.exports = {userRouter};