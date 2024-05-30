import express from 'express';
import {verifyToken} from '../utils/verifyUser.js'
import { create, deletepost, getposts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)  //anyone should be able to see the posts, so no need to verifyToken
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);

export default router;