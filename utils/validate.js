const jwt = require("jsonwebtoken");

const verifytoken = async(req, res, next) => {
    const token = req.headers.cookie.split("=")[1];
    console.log(`token: ${token}`);

    if (!token) {
        return res.status(401).json({message: "Access denied"});
    }
    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        console.log(req.user);
        
        next();
    } catch (err) {
        return res.status(403).json({message: "Invalid token"});   
    }
}

module.exports = verifytoken;