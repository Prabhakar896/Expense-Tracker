const generateToken = require("../../middlewares/generateToken");
const User = require("../../model/User");
const Income = require("../../model/Income"); 
const Expense = require("../../model/Expense"); 
const expressAsyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");

// ✅ Register User
const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, firstname, lastname, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ msg: "User already exists" });
    }


    try {
        const user = await User.create({ email, firstname, lastname, password, isAdmin });

        const token = generateToken(user._id);
          res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            msg: "Registered successfully & logged in!",
            token,  
            user: {
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                isAdmin: user.isAdmin
            },
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Fetch User Data
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
    try {
        const email = req.body.email || req.user?.email; 
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login User
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
    const { email, password } = req?.body;

    const userFound = await User.findOne({ email });
    if (userFound && (await userFound.isPasswordMatch(password))) {
        const token = generateToken(userFound._id);

         res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            _id: userFound._id,
            email: userFound.email,
            firstname: userFound.firstname,
            lastname: userFound.lastname,
            isAdmin: userFound.isAdmin,
            message: "Login successful",
            token
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

// ✅ Fetch All Users Data (Admin)
const fetchAllUsersData = expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only!" });
    }

    try {
        const incomes = await Income.find({});
        const expenses = await Expense.find({});
        res.status(200).json({ incomes, expenses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Upload Profile Picture (Cloudinary)
const uploadProfilePic = expressAsyncHandler(async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "No profilePic provided" });
        }

        // Upload to Cloudinary first
        const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
            width: 500,
            height: 500,
            crop: "fill",
        });

        // Update user profile pic in database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: uploadedResponse.secure_url },
            { new: true }
        );

        res.status(200).json({ profilePic: updatedUser.profilePic });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Logout User
const logoutUserCtrl = expressAsyncHandler(async (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { 
    registerUser, 
    fetchUsersCtrl, 
    loginUserCtrl, 
    fetchAllUsersData, 
    uploadProfilePic, 
    logoutUserCtrl 
};
