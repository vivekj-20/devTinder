const { mongoose,Schema } = require("mongoose");
const validator = require("validator");

const useSchema = new Schema({
    firstName:{
        type: String,
        required:true,
        trim:true,
        minLength:1,
        maxLength:50
    },
    lastName:{
        type: String,
        trim:true,
    },
    emailId:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        minLength:1,
        maxLength:50,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email id");
            }
        }
    },
    password:{
        type: String,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong");
            }
        }
    },
    age:{
        type: Number,
        trim:true,
        min:18
    },
    gender:{
        type: String,
        trim:true,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value))
              throw new Error("gender data is not valid");
        }
    },
    skills:{
        type:[String],
        default:"JavaScript",
        trim:true,
    }
},{
    timestamps:true,
});

module.exports = mongoose.model("user",useSchema);
