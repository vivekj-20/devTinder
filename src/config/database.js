const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://vivekjena20:ScU6FffSrzcR356W@nodejs.w5xhu.mongodb.net/NodeJS");
}

module.exports = connectDB;