import dotenv from 'dotenv';
import e from "express";
import connectDB from './db/index.js';
import { app } from './app.js';


dotenv.config({
    config:'./.env'
})
connectDB()
.then(()=>{
  app.listen(process.env.PORT || 3000,()=>{
    console.log(`running`);
  })
})
.catch((err)=>{
    console.log("MongoDb connection failed !!! ",err);
})

