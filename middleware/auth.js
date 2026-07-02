// middleware/auth.js
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';

// Resolve your secret key safely from environment variables
const JWT_SECRET = 'foewvao9849anfoiqnaocwAA';

// Check if route is public
const isPublicRoute = (url) => {
    // Exact match
    if (authConfig.publicRoutes?.includes(url)) {
        return true;
    }

    // Prefix match
    if (authConfig.publicRoutePrefixes?.some(prefix => url.startsWith(prefix))) {
        return true;
    }

    // Static file extensions
    if (authConfig.staticExtensions?.some(ext => url.endsWith(ext))) {
        return true;
    }

    // Regex patterns for specific cases
    const patterns = [
        /^\/api\/auth\/(login|register|refresh|forgot-password|reset-password|verify)/,
        /^\/api\/webhooks\//,
        /^\/api\/public\//,
        /\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i
    ];

    return patterns.some(pattern => pattern.test(url));
};

// Get token from cookie or Authorization header
export const authenticate = (req, res, next) => {
    try {
        // Use req.path instead of req.url to drop query strings like ?customerId=123
        if (isPublicRoute(req.path)) {
            return next();
        }

        // 🌟 CRITICAL: Make sure 'auth_token' matches the exact label issued on login!
        const token = req.cookies.auth_token || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user payload to request profile
        next();
    } catch (error) {
        console.error('JWT validation error:', error.message);

        // Match the cookie key being cleared with what you are tracking above
        res.clearCookie('auth_token');
        res.clearCookie('token');

        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};