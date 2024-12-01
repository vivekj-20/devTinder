const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const user = require("../model/user");

const auth = async (req,res,next)=>{
    const{token} = req.cookies;

        if(!token){
            throw new Error("Invalid Token")
        }

        const decodedString = await jwt.verify(token,"GOJO@Node");

        if(!decodedString){
            throw new Error("Invalid Token")
        }

        const data = await user.findById(decodedString);
        
        if(!data){
            throw new Error("No user found !!!");
        }
        req.data = data;
        next();
}
module.exports= auth;