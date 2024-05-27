import express from 'express'; //for creating a route
import { test, updateUser } from '../controllers/user.controller.js'; //.. because we need to go out 

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);

//if user is verified, user is added to the request and then only we update the user

export default router;

