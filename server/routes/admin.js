const express = require('express');
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const router = express.Router();
const adminLayout = '../views/layout/admin'


//Check Login
const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json( { message: "Unauthorized" } )
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({message:"Unauthorized"});
    }
}


//Get Method, Admin Route

router.get("/admin",(req,res,next)=>{
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }      
        res.render('admin/index',{locals, layout:adminLayout});
})

//Post Method, Check Login

router.post("/admin",(req,res,next)=>{
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
    const username = req.body.username;
    const password = req.body.password;
    //const {username,password} = req.body
    User.findOne({ username })
    .then((result)=>{
        if(!result){
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        bcrypt.compare(password, result.password)
        .then((validation)=>{
            if(!validation){
                return res.status(401).json({ message: "Invalid Credentials" });
            }
            const token = jwt.sign({ userId: result._id },jwtSecret)
            res.cookie('token',token,{httpOnly:true})
            res.redirect("/dashboard")
        })
    })
})

//Dashboard
router.get('/dashboard',authMiddleware,(req,res,next)=>{

    Post.find()
    .then((data)=>{
        locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
        res.render('admin/dashboard',{locals,data,layout:adminLayout})
    })
;})

//GET- Add new post
router.get('/add-post',authMiddleware,(req,res,next)=>{
        locals = {
            title: "Admin Add Post",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
        res.render('admin/add-post',{locals,layout:adminLayout})
;})


//POST- Add new post
router.post('/add-post',authMiddleware,(req,res,next)=>{
    const newPost = new Post({
        title: req.body.title,
        body: req.body.pbody
    })
    Post.create(newPost)
    .then(result=>res.redirect('/dashboard'))
    .catch(err=>console.log(err));
})

//GET- Edit post
router.get('/edit-post/:id',authMiddleware,(req,res,next)=>{
    locals = {
        title: "Edit Post",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
    Post.find({_id:req.params.id})
    .then((datas)=>{
        const data= datas[0];
        res.render('admin/edit-post',{locals,layout:adminLayout,data})
    })
;})

//POST- Edit post
router.post('/edit-post/:id',authMiddleware,(req,res,next)=>{
    const changes = {
        title: req.body.title,
        body: req.body.pbody
    }
    Post.updateOne({_id:req.params.id},{$set:changes})
    .then((result)=>{
        res.redirect('/dashboard')
    })
    .catch(err=>console.log(err));
})

//POST- DELete
router.post('/delete-post/:id',authMiddleware,(req,res,next)=>{
    Post.deleteOne({_id:req.params.id})
    .then((result)=>{
        res.redirect('/dashboard')
    })
    .catch(err=>console.log(err));
})


//Logout
router.get('/logout',(req,res,next)=>{
    res.clearCookie('token');
    res.redirect('/');
})


//Post Method, Register

router.post("/register",(req,res,next)=>{
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
    const username = req.body.username;
    const password = req.body.password;
    //const {username,password} = req.body
    bcrypt.hash(password, 10)
    .then((hashedpass)=>{
        User.create({
            username, password: hashedpass
        }).then((user) => {
            res.status(201).json({ message:"User Created",user })
        }).catch(err=>{
            res.status(409).json({ message: 'User Already in use' })
        })
    })
    .catch(err=>res.status(500).json({ message: 'Internal Server error' }))
})



module.exports = router;