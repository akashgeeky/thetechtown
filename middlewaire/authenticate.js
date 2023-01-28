const jwt = require("jsonwebtoken");
const User = require("../model/userSchema")
const Authenticate = async (req, res, next)=>{
    try{
        console.log("bhaiya ji ye middle waire chala to hai ab age ka pata nahi")
        const token = req.cookies.jwtoken;
        const verifyTOken = jwt.verify(token, process.env.Secret_key);
        const rootUser = await User.findOne({_id:verifyTOken._id,"tokens.token":token});
        if(!rootUser){
            throw new Error("user not Found")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    }catch(err){
        res.status(401).send("Unauthorized: No token provided")
        console.log(err);
    }

}
module.exports = Authenticate;