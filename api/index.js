import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO)

.then(()=>{
    console.log('MongoDB is connected')
}).catch(err=>{
    console.log(err);
})

const app = express();

app.use(express.json()); //to allow to send json to backend

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!'); //app is running on this port
})

//to interact with backend, we create a test api route
app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);