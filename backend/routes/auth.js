const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const router = express.Router();

// 1. Admin login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({
            message: "Login successful",
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error during login",
        });
    }
});

// 2. Check whether admin is logged in
router.get("/check", (req, res) => {
    const token = req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({
            authenticated: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({
            authenticated: true,
            adminId: decoded.id,
        });
    } catch (error) {
        return res.status(401).json({
            authenticated: false,
        });
    }
});

// 3. Admin logout
router.post("/logout", (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.json({
        message: "Logout successful",
    });
});

module.exports = router;