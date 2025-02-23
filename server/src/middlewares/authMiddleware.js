const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decodedUser = jwt.verify(token, process.env.JWT_KEY);
        req.user = await User.findById(decodedUser.id).select("-password");
       
        next();
    } catch (err) {
        res.clearCookie("authToken");
        res.status(401).json({ message: "Invalid or expired token" });
    }
});
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only!" });
    }
};
module.exports = { authMiddleware, adminOnly };
