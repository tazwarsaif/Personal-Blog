require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mainRouter = require("./server/routes/main")
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const adminRouter = require('./server/routes/admin');

const app = express()
const PORT = 5000 || process.env.PORT;

app.use(express.urlencoded({ extended:false }))
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
                mongoUrl:process.env.MONGODB_URI
        })
}))

//Templeting Engine
app.set('view engine','ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.set('layout','./layout/main');

app.use(mainRouter);
app.use(adminRouter);

// Connect to DB
mongoose.connect(process.env.MONGODB_URI).then((result)=>{
        console.log("Database Connected:",result.connection.host)
        app.listen(PORT, ()=>{
        console.log("Listening to port",PORT)});
})
