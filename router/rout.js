const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewaire/authenticate")
require('../db/conn');
const User = require("../model/userSchema")


router.post("/register", async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "aapne koi fild khali chod diya hai" })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "bhaiya is email se koi phele se hi hai" })
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password and cpassword match nahi kar raha hai" })
        } else {
            const user = new User({ name, email, phone, work, password, cpassword })
            await user.save();
            res.status(201).json({ message: "user registerd successfuly" })
        }

    } catch (err) {
        console.log(err)
    }
})
router.post("/signin", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Plz fild the data" });
        }
        const userLogin = await User.findOne({ email: email });
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token,"bhiya ye token hai");
            res.cookie("jwtoken", token,{
                expires: new Date(Date.now()+25892000000),
                httpOnly:true
            });
            if (!isMatch) {
                res.status(400).json({ error: "password sahi nahi hai" });
            }
            else {
                res.json({ message: "user ne signin kar liya wo bhi sahi se" });
            }
        }else{
            res.status(400).json({ error: "email sahi nahi hai" });
        }
        

    } catch (err) {
        console.log(err)
    }
});

// about us ka page hai ye
router.get("/about", authenticate, (req, res) => {
    console.log("middleware sahi se kam kar raha hai")
    res.send(req.rootUser);
})


// get user data fron contact page and home page
router.get("/getdata",authenticate, (req,res)=>{
    console.log("middleware sahi se kam kar raha hai")
    res.send(req.rootUser);
})

router.post("/contact",authenticate, async(req,res)=>{
    try{
        const{name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            console.log("bhaiya ji contact box me kuch error aagaya hai ab usko bhi dekh lo yaar kya hi kar sakte hai🤪", req.body)
            return res.json({error:"Please filled the contact form"})
        }
        const userContact = await User.findOne({_id: req.userID})
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"user contact successfully"})
        }
    }catch(error){
        console.log(error)
    }
})

router.post("/coursesave",authenticate, async(req,res)=>{
    try{
        const{course,courseDate} = req.body;
        if(!course||!courseDate){
            return res.json({error:"Please filled the contact form"})
        }
        const courseName = await User.findOne({_id: req.userID})
        if(courseName){
            const UserCourse = await courseName.addCourseName(course,courseDate);
            await courseName.save();
            res.status(201).json({message:"user contact successfully"})
        }
    }catch(error){
        console.log(error)
    }
})

// logout ka page hai ye
router.get("/logout", (req, res) => {
    console.log("ye log out wala page hai bhoi")
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("user logout ho gaya hai bhoi");
})
module.exports = router;