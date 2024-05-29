import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async(req,res,next) =>{
    if(!req.user.isAdmin){
        next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        next(errorHandler(400, 'Please provide all the required fields'))
    }
    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, ''); //for SEO purposes
    const newPost = new Post({
        ...req.body, //whatever the request body has like title, content or image
        slug, 
        userId: req.user.id, //to check which admin created the post
    });
    try {
        const savedPost = await newPost.save(); //save this post
        res.status(201).json(savedPost) //201 means something has been created
    } catch (error) {
        next(error);
    }
}

