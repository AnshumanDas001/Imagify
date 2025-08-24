import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing details"})
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false,message:"User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,message:"User registered successfully",token,user:{name:user.name}})

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body;
        
        if(!email || !password){
            return res.json({success:false,message:"Email and password are required"})
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,message:"User logged in successfully",token,user:{name:user.name}})
        }
        else{
            return res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(error){
        console.log("Login error:", error);
        res.json({success:false,message:"Login failed. Please try again."})
    }
}

const userCredits = async (req,res)=>{
    try{
        console.log("Credits API called");
        console.log("req.body:", req.body);
        console.log("req.user:", req.user);
        console.log("userID from req.body:", req.body?.userID);
        console.log("userID from req.user:", req.user?.id);
        
        // Get userID from req.body (set by auth middleware) or req.user as fallback
        const userID = req.body?.userID || req.user?.id;

        if(!userID){
            console.log("No userID found in req.body or req.user");
            return res.json({success:false,message:"User ID not found"})
        }

        console.log("Attempting to find user with ID:", userID);
        const user = await userModel.findById(userID)
        if(!user){
            console.log("User not found in database for ID:", userID);
            return res.json({success:false,message:"User not found"})
        }
        
        console.log("User found:", user.name, "Credits:", user.creditBalance);
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
    }
    catch(error){
        console.log("User credits error:", error);
        console.log("Error stack:", error.stack);
        res.json({success:false,message:"Failed to fetch user credits"})
    }
}

export {registerUser,loginUser,userCredits}