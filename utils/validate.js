const jwt = require("jsonwebtoken");

const verifytoken = async(req, res, next) => {
    const token = req.headers.cookie.split("=")[1];
    console.log(`token: ${token}`);

    if (!token) {
        return res.status(401).json({message: "Access denied"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTS);
        req.user = decoded;
        // console.log(req.user.role, 1);
        
        if (req.user.role == "customer") {
            return res.status(400).json({message: "Cant perform this action"});      
        }
        next();
    } catch (err) {
        return res.status(403).json({message: "Invalid token"});   
    }
}

module.exports = verifytoken;