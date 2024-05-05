import { UserModel } from "../schema/user.schema.js";

export class UserRepository{

    /* function for register a new user in database */
    async signUp(newUserData)
    {
        try{
            const newUser = new UserModel(newUserData);
            await newUser.save();
            return {success : true, msg : "Register Successfully"};
        }
        catch(err)
        {
            console.log(err);
            throw err;
        }
    }

    /* function for finding a user by email*/
    async findUserByEmail(email)
    {
        return await UserModel.findOne({email : email});
    }

    /* function for updating a user password in database when password resets*/
    async resetPassword(email,newPassword)
    {
        const user = await UserModel.findOne({email : email});
        user.password = newPassword;
        const savedUser = await user.save();
        return savedUser;
    }

    /* function for checking a user reset password link valid or not or expires*/
    async findUserForPasswordReset(token)
    {
        return await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        })
    }
}