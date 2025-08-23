import jwt from "jsonwebtoken";

const userAuth = async (req,res,next)=>{
    const {token} = req.headers
    
    if(!token){
        return res.json({success:false,message:"Unauthorized Login"})
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.body.userID=tokenDecode.id;
        }
        else{
            return res.json({success:false,message:"Unauthorized Login"})
        }
        next();
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Invalid token"})
    }
}

export default userAuth;
