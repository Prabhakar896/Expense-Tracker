const express = require("express");
const { 
    registerUser, fetchUsersCtrl, loginUserCtrl, fetchAllUsersData ,uploadProfilePic,logoutUserCtrl
} = require("../../controllers/users/usersCtrl");
const { adminOnly, authMiddleware } = require("../../middlewares/authMiddleware");
const User=require("../../model/User")
const userRoute = express.Router();
const fileUpload = require("express-fileupload");
userRoute.post("/register", registerUser);
userRoute.post("/login",authMiddleware, loginUserCtrl);
userRoute.get("/", authMiddleware, fetchUsersCtrl);
userRoute.get("/fetchall", authMiddleware, adminOnly, fetchAllUsersData);
userRoute.post("/logout", logoutUserCtrl);

userRoute.use(fileUpload({ useTempFiles: true }));
userRoute.put("/upload-profile-pic", authMiddleware, uploadProfilePic);


module.exports = userRoute;
