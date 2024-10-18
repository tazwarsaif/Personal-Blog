const express = require('express');
const Post = require("../models/Post")
const router = express.Router();


//Get Method, Home Route

router.get("",(req,res,next)=>{
    Post.find().then(data=>{
        const locals = {
            title: "NodeJS Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }      
        res.render('index',{data,locals});
    })
    .catch(err=>console.log(err))
})



//Get Method, Post Route

router.get("/post/:id",(req,res,next)=>{
    const id = req.params.id;
    console.log(id);
    Post.find({ _id:id }).then(datarr=>{
        console.log(datarr[0]);
        const data = datarr[0];
        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
        res.render('post',{data,locals});
    })
    .catch(err=>console.log(err))
})


// Post Method, Search Route

router.post('/search',(req,res,next)=>{
    let searchTerm = req.body.searchTerm;
    const locals = {
        title: "Search",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    Post.find({$or : [
        {title : new RegExp(searchNoSpecialChar,'i')},
        {body : new RegExp(searchNoSpecialChar,'i')}
    ]})
    .then((data)=>{
        console.log(data);
        res.render('search',{data,locals});
    })
    .catch(err=>console.log(err));
})



router.get("/about",(req,res,next)=>{
    res.render('about');
})

router.get("/contact",(req,res,next)=>{
    res.render('contact');
})

module.exports = router;