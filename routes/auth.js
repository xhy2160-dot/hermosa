// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import db from '../models/index.js';
const { Staff } = db;


const router = express.Router();
const JWT_SECRET = 'foewvao9849anfoiqnaocwAA'


// POST: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' can contain either email string or phone string

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Phone and password are required"
            });
        }

        // Find staff by email OR phone
        const staff = await Staff.findOne({
            where: {
                [Op.or]: [
                    { email: email.trim().toLowerCase() },
                    { phone: email.trim() }
                ]
            }
        });

        // Check if staff exists
        if (!staff) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials." // Generic message avoids account enumeration
            });
        }

        // Check if account is active
        if (staff.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: "Account is inactive. Please contact system administration."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Generate JWT token using centralized shared secret
        const token = jwt.sign(
            {
                id: staff.id,
                email: staff.email,
                phone: staff.phone,
                role: staff.role,
                name: staff.name
            },
            JWT_SECRET, // ✅ Uses centralized secret key string
            { expiresIn: '7d' }
        );

        // Cookie Configuration Attributes
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // false on localhost http, true on live https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // ✅ Set matching cookies to bridge old and new code layers
        res.cookie('auth_token', token, cookieOptions);
        res.cookie('token', token, cookieOptions);

        // Return user data profile (excluding password)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: staff.id,
                email: staff.email,
                phone: staff.phone,
                name: staff.name,
                role: staff.role
            }
        });

    } catch (error) {
        console.error('Login routing exception:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET: /api/auth/profile
router.get('/profile', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        res.json({ authorized: true, user: verified });
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
});

router.get('/me', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        res.json({ user: req.user });
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
});

// Export the router group
export default router;