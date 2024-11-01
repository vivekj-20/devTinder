const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://vivekjena20:khuA2CWVgzVZ2xuw@nodejs.w5xhu.mongodb.net/NodeJS");
}

module.exports = connectDB;