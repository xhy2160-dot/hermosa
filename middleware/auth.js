//middleware/auth.js

import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;

const isPublicRoute = (path) => {
    if (authConfig?.publicRoutes?.includes(path)) return true;
    if (authConfig?.publicRoutePrefixes?.some(prefix => path.startsWith(prefix))) return true;
    if (authConfig?.staticExtensions?.some(ext => path.endsWith(ext))) return true;

    const patterns = [
        // Added 'me' and 'check' to allowed auth subroutes
        /^\/api\/auth\/(login|register|refresh|forgot-password|reset-password|verify|me|check)/,
        /^\/api\/webhooks\//,
        /^\/api\/public\//,
        /\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i
    ];

    return patterns.some(pattern => pattern.test(path));
};

export const authenticate = (req, res, next) => {
    try {
        if (isPublicRoute(req.path)) {
            return next();
        }

        // Optional chaining prevents throwing TypeError if cookies are missing
        const token = req.cookies?.auth_token || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT validation error:', error.message);

        // Ensure path matches cookie creation settings
        const cookieOptions = { path: '/', httpOnly: true };
        res.clearCookie('auth_token', cookieOptions);
        res.clearCookie('token', cookieOptions);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};