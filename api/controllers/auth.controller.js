import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req,res,next)=>{  //async as we need for mongoDB to authenticate first and then allow access
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password,10); //here 10 indicates the number of salt rounds of mixing, wait till the password is hashed before perfoming any ops using it

    const newUser = new User({ //here, we use and create the defined user model from user.model.js
        username,
        email,
        password:hashedPassword,
    });

    try {
        await newUser.save(); //wait until the user is saved
        res.json('Signup successful!')
    } catch (error) {
        next(error);
    }

}