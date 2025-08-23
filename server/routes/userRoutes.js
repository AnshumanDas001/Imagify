import { registerUser, loginUser, userCredits } from "../controllers/userController.js"
import express from "express";
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/credits',userAuth,userCredits);
userRouter.get('/working',(req,res) => {
    console.log("User API is working");
     res.send("API is working");
});

export default userRouter;
