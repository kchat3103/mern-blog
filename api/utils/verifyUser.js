import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js'

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    //verify token based on the secret key, which gives us error or parsed user data
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user; //this comes from the cookie
        next(); //goes to updateUser function in user.controller.js
    });
}


