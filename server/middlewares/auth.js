import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.headers
    
    console.log("Auth middleware called");
    console.log("Token received:", token ? "Present" : "Missing");
    
    if (!token) {
        console.log("No token provided");
        return res.json({ success: false, message: "Unauthorized Login" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Token decoded:", tokenDecode);
        
        if (tokenDecode.id) {
            // Initialize req.body if it doesn't exist (important for GET requests)
            if (!req.body) {
                req.body = {};
            }
            req.body.userID = tokenDecode.id;
            // Also set it in req.user as an alternative
            req.user = { id: tokenDecode.id };
            console.log("UserID set in req.body:", req.body.userID);
        }
        else {
            console.log("No ID in token");
            return res.json({ success: false, message: "Unauthorized Login" })
        }
        next();
    }
    catch (error) {
        console.log("Token verification error:", error);
        res.json({ success: false, message: "Invalid token" })
    }
};

export default userAuth;
