const { mongoose,Schema } = require("mongoose");

const useSchema = new Schema({
    firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
    },
    password:{
        type: String,
    },
    age:{
        type: String,
    },
    gender:{
        type: String,
    },
});

module.exports = mongoose.model("user",useSchema);
