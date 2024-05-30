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

export const getposts = async (req,res,next)=>{
    try {

        //parseInt is used to convert to number

        const startIndex = parseInt(req.query.startIndex) || 0;//to show which post to start fetching from, this can be recieved either from the request or we can start from 0

        const limit = parseInt(req.query.limit) || 9; //number of posts that the user can see at a time, will have to click show more to see more number of posts

        const sortDirection = req.query.order === 'asc' ? 1:-1; //MongoDB shows ascending if 1, descending if -1

        const posts = await Post.find({ //using post modal from post.model.js
            ...(req.query.userId && {userId: req.query.userId}), //find for this user
            ...(req.query.category && {category: req.query.category}), //find for this category
            ...(req.query.slug && {category: req.query.slug}), //find for this slug
            ...(req.query.postId && {_id: req.query.postId}), //find for this post id, in mongoDB, post id is _id
            ...(req.query.searchTerm && {
                $or:[ //$or for finding whatever they want in the blog posts easier using both title and content of the post together
                    {title:{$regex :req.query.searchTerm, $options:'i'}}, //regex is a tool in mongoDB for searching
                    {content:{$regex :req.query.searchTerm, $options:'i'}}, //regex is a tool in mongoDB for searching
                ],
            }),
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit); //updated using the asc or desc

        const totalPosts = await Post.countDocuments(); //count total number of posts for dashboard

        const now = new Date(); //current time

        const oneMonthAgo = new Date( //to count total number of new posts for dashboard
            now.getFullYear(), //this year
            now.getMonth()-1, //one month ago
            now.getDate(), //get time now
        );

        const lastMonthPosts = await Post.countDocuments({  //to get last months post
            createdAt:{$gte:oneMonthAgo}, //sort it from time of creation greater than one month ago
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (error) {
        next(error)
    }
}