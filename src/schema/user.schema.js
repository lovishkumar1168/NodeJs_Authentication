import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email : {
        type : String,
        unique: true
    },
    password: {
        type : String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save",async function(next){
    const hashedPassword = await bcrypt.hash(this.password,12);
    this.password = hashedPassword;
    next();
})

userSchema.methods.getResetPasswordToken = async function () {
    const token = jwt.sign({ email: this.email }, process.env.JWT_TOKEN, { expiresIn: '10m' });
    const resetPasswordExpire = Date.now() + 10* 60 * 1000; // Expires in 1 hour
    this.resetPasswordToken = token;
    this.resetPasswordExpire = resetPasswordExpire;
    await this.save();
    return token;
 };
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

export const UserModel = mongoose.model("User",userSchema);