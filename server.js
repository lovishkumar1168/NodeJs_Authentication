import dotenv from "dotenv";
import express from "express"
import { connectToMongoDBUsingMongoose } from "./src/config/mongooseConfig.js";
import { userRouter } from "./src/routes/user.routes.js";
import bodyParser from "body-parser";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import "./passport.js"
const server = express();
dotenv.config();

server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),"src","views"));

server.use(session(
    {
        secret : 'secretKey',
        resave : true,
        saveUninitialized : true,
        cookie : {secure : false}
    }
))
server.use(flash()); 
server.use(expressLayouts);
server.use(express.urlencoded({extended:true}))
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());

// Auth  
server.get('/auth' , passport.authenticate('google', { scope: 
    [ 'email', 'profile' ] 
})); 
  
// Auth Callback 
server.get( '/auth/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/callback/success', 
        failureRedirect: '/auth/callback/failure'
})); 
  
// Success  
server.get('/auth/callback/success' , (req , res) => { 
    if(!req.user) 
        res.redirect('/auth/callback/failure'); 

    req.flash("success","successfully entered");
    res.redirect("/dashboard"); 
}); 
  
// failure 
server.get('/auth/callback/failure' , (req , res) => { 
    res.send("Error"); 
}) 

server.use("/",userRouter);

server.listen(process.env.PORT,()=>{
    console.log("server is listening at 8000");
    connectToMongoDBUsingMongoose();
})