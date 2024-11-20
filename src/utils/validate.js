const validator = require("validator");

const validateData = (req) =>{
    const {firstName,lastName,password,emailId} = req.body;

    if(firstName.trim().length === 0 || lastName.trim().length === 0){
        throw new Error("Invalid Name");
    }
    if(password.trim().length === 0 || !validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
    if(emailId.trim().length === 0 || !validator.isEmail(emailId)){
        throw new Error("Invalid emailId");   
    }
}

module.exports ={validateData};