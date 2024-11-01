const auth = (req,res,next)=>{
    const isAuth = 2025;
    const token = 2025;
    
    if(token != isAuth){
        res.status(401).send({handeledErrorMessage:"unauthorised user"});
    }
    else{
        next();
    }
}

const adminAuth = (req,res,next)=>{
    const isAuth = 2025;
    const token = 2025;
    
    if(token != isAuth){
        res.status(401).send({handeledErrorMessage:"unauthorised user"});
    }
    else{
        next();
    }
}

module.exports={auth,adminAuth};