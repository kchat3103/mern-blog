import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

//userId is coming from req.params and cookie is coming from req.user, if these are the same, then the user is verified.

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user')); //invalid user
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
    try {
      //update the user based on the ID
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: { //$set is used to set whatever parameters that is inside this block
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          },
        },
        { new: true } //sends back the new information
      );
      const { password, ...rest } = updatedUser._doc; //send the updated user without password
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  }
};

export const deleteUser = async(req, res, next) =>{
  if(req.user.id!==req.params.userId){
    return next(errorHandler(403, 'You are not allowed to delete this user'))
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error)
  }
};

export const signout = async(req,res,next)=>{
  try{
    res.clearCookie('access_token').status(200).json('User has been signed out'); //delete the access_token/cookie of the user
  }
  catch(error){
    next(error);
  }
};