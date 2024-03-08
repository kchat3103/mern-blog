import express from 'express'; //for creating a route
import { test } from '../controllers/user.controller.js'; //.. because we need to go out 

const router = express.Router();

router.get('/test', test
);

export default router;

