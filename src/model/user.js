const { mongoose,Schema } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        enum: {
          values: ["male", "female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
        // validate(value){
        //     if(!["male","female","others"].includes(value))
        //       throw new Error("gender data is not valid");
        // }
    },
    skills:{
        type:[String],
        default:"JavaScript",
        trim:true,
    },
    photoUrl:{
        type: String,
        trim:true,
    },
    about:{
        type: String,
        trim:true,
    },
},{
    timestamps:true,
});

useSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({_id:user._id},"GOJO@Node",{ expiresIn: '7h' });

    return token;
};

useSchema.methods.PasswordCheck = async function (passwordEnteredByUser) {
    const user = this;
    const isValidPassword = await bcrypt.compare(passwordEnteredByUser, user.password);
    return isValidPassword;
};

module.exports = mongoose.model("user",useSchema);
