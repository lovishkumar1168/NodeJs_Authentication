import { sendPasswordResetConfirmationMail } from "../../utils/passwordResetConfirmationMail.js";
import { sendResetPasswordLink } from "../../utils/sendResetPasswordLink.js";
import { sendWelcomeMail } from "../../utils/welcomeMail.js";
import { UserRepository } from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
export class UserController{
    constructor()
    {
        this.userRepository = new UserRepository();
    }

    /* function for rendering signup page */
    async renderSignUp(req,res,next)
    {
        try{
            res.render("signUp",{message : null})
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /* Function for posting data in database after user successfully registered*/
    async postSignUp(req,res,next)
    {
        try{
            const response = await this.userRepository.signUp(req.body);
            await sendWelcomeMail(req.body);
            req.flash("success","register successfully");
            res.redirect("/signIn");
        }
        catch(err)
        {
            if (err.code === 11000 && err.keyPattern.email === 1) 
                res.render("signUp",{message : "email already registered"});
        }
    }

    /* function for rendering signIn page */
    async renderSignIn(req,res,next)
    {
        try{
            res.render("signIn",{message : req.flash(),error : null});
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /* Function for checking userCredentials and then redirect to dashboard page*/
    async postSignIn(req,res,next)
    {
        try{
            let {email,password} = req.body;
            const user = await this.userRepository.findUserByEmail(email);
            if(!user)
            {
               return res.render("signIn",{error : "email not registered",message : null});
            }
            const match = await user.comparePassword(password);
            if(!match)
            {
               return res.render("signIn",{error : "invalid credentials",message : null});
            }
            req.session.user = {name : user.name, email, password}
            req.flash("success","signin successfully");
            res.redirect("/dashboard");
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /* function for rendering dahsboard page */
    async renderDashboard(req,res,next)
    {
        if(req.user && req.user.provider == "google")
            {
                const user = {name : req.user.displayName, email : req.user.email};
                await sendWelcomeMail(user);
                return res.render("dashboard",{user,messages : req.flash()});
            }
        res.render("dashboard",{user : req.session.user,messages : req.flash()});
    }

    /* function for rendering resetPassword page (When user login into site and click on reset password)*/
    async renderResetPassword(req,res,next)
    {
        res.render("resetPassword",{user : req.session.user,message : null});
    }

    /* Function for reset user's password and then redirect to dashboard page*/
    async postResetPassword(req,res,next)
    {
        const {oldPassword,newPassword} = req.body;
        const user = await this.userRepository.findUserByEmail(req.session.user.email);
        const match = await user.comparePassword(oldPassword);
        if(!match)
        {
            return res.render("resetPassword",{user,message : "old password incorrect"});
        }
        const updatedUser = await this.userRepository.resetPassword(user.email,newPassword)
        req.session.user.password = newPassword;
        await sendPasswordResetConfirmationMail(updatedUser);
        req.flash("success","password reset successfully");
        res.redirect("/dashboard");
    }

    /* Function for logout page*/
    async renderlogOut(req,res,next)
    {
        req.session.destroy((err)=>{
            if(err)
            {
              console.log(err);
            }
            else
            {
                res.render("logout");
            }
        })
    }

    /* function for rendering forgot password page */
    async renderForgotPassword(req,res,next)
    {
        try{
            res.render("forgotPassword",{message : null,error: null});
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /* function for sending reset password link email to user*/
    async postForgotPassword(req,res,next)
    {
        try{
            const {email} = req.body;
            const user = await this.userRepository.findUserByEmail(email);
            if(!user)
            {
                return res.render("forgotPassword",{error : "user not found",message : null});
            }
            const token = await user.getResetPasswordToken();
            const resetPasswordUrl = process.env.RESET_PASSWORD_LINK;
            await sendResetPasswordLink(user,`${resetPasswordUrl}/${token}`);
            res.render("forgotPassword",{message : "mail has been sent",error: null});
        }
        catch(err)
        {
            console.log(err);
        }
    }

    /* function for rendering signup page (This is the page when user clicks on reset password link which user recevies on mail)*/
    async renderUpdatePassword(req,res,next)
    {
        const token = req.params.token;
        const user = await this.userRepository.findUserForPasswordReset(token);
        console.log(user);
        if(!user)
        {
            return res.render("expireLink");
        }
        return res.render("updatePassword",{message : null,token});
    }

    /* function for updating user's password when user submit a update password form*/
    async postUpdatePassword(req,res,next)
    {
        const {password,confirmPassword} = req.body;
        const token = req.params.token;
        if(password!=confirmPassword)
        {
            return res.render("updatePassword",{message : "password and confirm password not same",token});
        }
        let email;
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);
            email = decoded.email;
        } 
        catch(err)
        {
            console.log(err);
        }
        const user = await this.userRepository.resetPassword(email,password);
        await sendPasswordResetConfirmationMail(user);
        req.flash("success","password reset successfully");
        res.redirect("/signIn");
    }
}