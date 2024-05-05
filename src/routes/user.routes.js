import express from "express";
import { UserController } from "../controllers/user.controller.js";
import expressLayouts from "express-ejs-layouts";

export const userRouter = express.Router();
const userController = new UserController();


userRouter.get("/dashboard",(req,res,next)=>{
    userController.renderDashboard(req,res,next);
})

userRouter.get("/resetPassword",(req,res,next)=>{
    userController.renderResetPassword(req,res,next);
})

userRouter.post("/resetPassword",(req,res,next)=>{
    userController.postResetPassword(req,res,next);
})

userRouter.get("/forgot-password",(req,res,next)=>{
    userController.renderForgotPassword(req,res,next);
})

userRouter.post("/forgot-password",(req,res,next)=>{
    userController.postForgotPassword(req,res,next);
})

userRouter.get("/update-password/:token",(req,res,next)=>{
    userController.renderUpdatePassword(req,res,next);
})
userRouter.post("/update-password/:token",(req,res,next)=>{
    userController.postUpdatePassword(req,res,next);
})

userRouter.get("/signin",(req,res,next)=>{
    userController.renderSignIn(req,res,next);
})

userRouter.post("/signin",(req,res,next)=>{
    userController.postSignIn(req,res,next);
})

userRouter.get("/logout",(req,res,next)=>{
    userController.renderlogOut(req,res,next);
})

userRouter.get("/",(req,res,next)=>{
    userController.renderSignUp(req,res,next);
})

userRouter.post("/",(req,res,next)=>{
    userController.postSignUp(req,res,next);
})