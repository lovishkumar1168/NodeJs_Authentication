import mongoose from "mongoose"

export const connectToMongoDBUsingMongoose = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});
        console.log("connected to database using mongoose");
    }
    catch(err)
    {
        console.log(err);
    }
}