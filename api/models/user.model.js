import mongoose from "mongoose";

//create user model

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }, 
    }, {timestamps:true} // to save time of creation of users and time of update
);

const User = mongoose.model('User',userSchema); //create model

export default User; // can use this model later during sign up when we create a user or perform updates