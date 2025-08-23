import express from 'express';
import { GenerateImage } from "../controllers/imageController.js"
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image',userAuth, GenerateImage);
imageRouter.get('/working',(req,res) => {
     res.send("API is working");
});

export default imageRouter;
