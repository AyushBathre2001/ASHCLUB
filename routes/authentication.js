const express = require('express')
const User = require('../models/userModel')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const router = express.Router()

cloudinary.config({
    cloud_name: "dby0aqes3",
    api_key: "515566577516222",
    api_secret: "mbfOmMyAUOpLOXFuitJtuLf4BT0"
  });
  


//signup api
router.post('/signup',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }), async (req, res) => {
        let success = false

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(),"success":success});
        }

        try {
            const { name, email, password } = req.body
            const file = req.files.image
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password,salt)
            cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
                const user = await User.create({
                    name,
                    email,
                    password:hash,
                    pic: result.url
                })

                if(user){
                    success = true
                    res.json({"success":success})
                }
                else{
                    res.json({"success":success})
                }
            })

        } catch (error) {
            res.send(error)
        }
    })


//login api
router.post('/login',async(req,res)=>{
    let success = false
    try {
        const {username,password} = req.body
        const user = await User.findOne({email:username})
        if(user){
            const original = await bcrypt.compare(password,user.password)
            if(original){
                success = true
                const data = {
                    id:user._id
                }
                const token = jwt.sign(data,process.env.JWT_SECRET)
                const auth = {
                    user:user,
                    token:token
                }
            
                res.json({"success":success,"auth":auth})

            }
            else{
                res.json({"success":success})
            }
        }
        else{
            res.json({"success":success})
        }
    } catch (error) {
        res.send(error)
    }

})

//fetch user details
router.get('/getuser',fetchuser,async(req,res)=>{
    try {
        const userID = req.user
        const user = await User.findById(userID)
        res.json(user)
    } catch (error) {
         res.send(error)
    }
})


//search user api
router.get('/find',fetchuser,async (req,res)=>{
    try {
        const userID = req.user
        const keyword = req.query.search ? {
            $or:[
                {name:{$regex:req.query.search,$options:'i'}},
                {email:{$regex:req.query.search,$options:'i'}}
            ]
        }:{}
        const user = await User.find(keyword).find({_id:{$ne:userID}})
        res.json(user)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router