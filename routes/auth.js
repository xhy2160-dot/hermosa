import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import db from '../models/index.js';

const { Staff } = db;
const router = express.Router();

// Always fall back to process.env.JWT_SECRET to keep keys synchronized
const JWT_SECRET = process.env.JWT_SECRET || 'foewvao9849anfoiqnaocwAA';

// Cookie options helper ensuring consistency
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // Use 'lax' for production on same site / proxy
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// POST: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Phone and password are required"
            });
        }

        const staff = await Staff.findOne({
            where: {
                [Op.or]: [
                    { email: email.trim().toLowerCase() },
                    { phone: email.trim() }
                ]
            }
        });

        if (!staff) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        if (staff.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: "Account is inactive. Please contact system administration."
            });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            {
                id: staff.id,
                email: staff.email,
                phone: staff.phone,
                role: staff.role,
                name: staff.name
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const cookieOptions = getCookieOptions();
        res.cookie('auth_token', token, cookieOptions);
        res.cookie('token', token, cookieOptions);

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
            message: "Internal server error"
        });
    }
});

// GET: /api/auth/me (Session Check on Vue Page Refresh)
router.get('/me', async (req, res) => {
    const token = req.cookies?.auth_token || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const verified = jwt.verify(token, JWT_SECRET);

        // Return verified decoded JWT payload to Vue store
        return res.status(200).json({
            success: true,
            user: {
                id: verified.id,
                email: verified.email,
                phone: verified.phone,
                name: verified.name,
                role: verified.role
            }
        });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});

// POST: /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
            path: '/'
        };

        res.clearCookie('auth_token', cookieOptions);
        res.clearCookie('token', cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Logout routing exception:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;