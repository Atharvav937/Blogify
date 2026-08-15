require("dotenv").config();
const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 8005;
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const Blog=require('./model/blog');

const userRouter = require('./router/user');
const blogRouter = require('./router/blog');

const checkForAUthenticationCookie = require('./middlewear/authentication');

mongoose.connect(process.env.MONGO_URL)
.then((e)=> console.log("DB Connected"))
.catch((e)=> console.log("DB Connection Failed"));

//middlewear
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAUthenticationCookie('token'));
app.use(express.static(path.resolve('./public'))); // to show image - express have to treat it as static 

app.set('view engine','ejs');
app.set('views',path.resolve("./views"));


app.use('/',userRouter);
app.use('/user',userRouter);
app.use('/blog',blogRouter);


app.get('/',async (req,res)=>{
    const allBlogs= await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
});




app.listen(PORT,()=>console.log('Server Successfully'));