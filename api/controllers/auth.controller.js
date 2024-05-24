import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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
};

export const signin = async(req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password || email ==='' || password===''){
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400,'Invalid Password'));
        }
        const token = jwt.sign( //sign id with secret key of the user given by JWT_SECRET
            {id: validUser._id}, process.env.JWT_SECRET);//session expires when user closes the browser
            const {password:_pass, ...rest}= validUser._doc; 

            res.status(200).cookie('access_token',token,{ //sent access token  to cookie
                httpOnly:true
            }).json(rest); //send this back to user given by validUser without the password
    } catch (error) {
        next(error);
    }
};