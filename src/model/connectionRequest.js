const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
       type: mongoose.Schema.Types.ObjectId,
       required: true,
    },
    toUserId:{
       type: mongoose.Schema.Types.ObjectId,
       required: true,
    },
    status:{
       type: String,
       required: true,
       enum:{
        values: ["accepted","rejected","interested","ignored"],
        message : '${VALUE} is incorrect status type',
       },
    },  
 },
 {timestamps: true}
);

connectionRequestSchema.index({fromUserId: 1,toUserId: 1});

connectionRequestSchema.pre("save", function (next) {
    const connection = this;
    
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
})


const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
);
  
module.exports = ConnectionRequestModel;