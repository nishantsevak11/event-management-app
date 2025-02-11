const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();




router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔹 Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // 🔹 Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔹 Save User
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // 🔹 Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id });  // ✅ Send token immediately after signup
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id });  // ✅ Send `userId` in response
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Guest Login (Limited Access)
router.post("/guest-login", (req, res) => {
    const guestUser = {
        userId: "guest",
        isGuest: true
    };

    const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, userId: "guest" }); 
});

// 🔹 Get User Details
router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});


module.exports = router;
