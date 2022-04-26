const express=require("express");
const path=require("path");
const app=express();
const cookieParser=require("cookie-parser");

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config({path:"Backend/config/config.env"});
}

//using middlewares
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser());

//importing routes
const post=require("./routes/post");
const user=require("./routes/user");

//using routes
app.use("/api/v1",post);
app.use("/api/v1",user);

app.use(express.static(path.join(__dirname,"../Frontend/build")));
app.get('*',(req,res)=> {
    res.sendFile(path.resolve(__dirname,"../Frontend/build/index.html"));
})

module.exports=app;