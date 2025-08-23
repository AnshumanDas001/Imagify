import userModel from "../models/userModel.js";
import FormData from 'form-data'
import axios from "axios";

export const GenerateImage = async (req,res)=>{
    try{
        const {userID,prompt}=req.body;

        const user = await userModel.findById(userID);
        if(!user||!prompt){
            return res.json({success:false,message:"Missing Details"})
        }
        if(user.creditBalance===0||user.creditBalance<0){
            return res.json({success:false,message:"Insufficient Credits"})
        }

        const formData = new FormData()
        formData.append('prompt',prompt)
        
        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
            headers:{
                "x-api-key":process.env.CLIPDROP_API,
            },
            responseType:'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;
        await userModel.findByIdAndUpdate(userID,{
            creditBalance:user.creditBalance-1
        })

        res.json({success:true,message:"Image generated successfully",image:resultImage,credits:user.creditBalance-1})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}