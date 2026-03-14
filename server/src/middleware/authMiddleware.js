const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async(req,res,next) =>
{
    try{
         const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;  //attach data in request body in betwwen req and response
    next();

    }
    catch(err)
    {
        return res.status(401).json({mssg : "Token invalid or expire"})
    }
   


}

module.exports = authMiddleware;