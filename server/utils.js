const jwt = require('jsonwebtoken');
require('dotenv').config()
const secretKey = process.env.secretKey;

const authenticateToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        
        return res.status(401).json({error:"Auth token required"});
    }
    else{
        jwt.verify(token,secretKey,(err,user) =>{
            if(err)
                return res.status(401).json({error:"Invalid Token"});
            else
            {
                req.user = user;
                next();
            }
        });
    }
}

module.exports = {authenticateToken};