// config/auth.js
export const authConfig = {
    // Public routes (exact match)
    publicRoutes: [
        '/',
        '/health',
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/refresh',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/auth/verify-email',
        '/api/docs',
        '/api/swagger',
    ],

    // Public route prefixes (wildcard)
    publicRoutePrefixes: [
        '/api/public',
        '/static',
        '/public',
        '/uploads',
        '/images',
        '/assets',
        '/api/webhooks',
    ],

    // Static file extensions
    staticExtensions: [
        '.css', '.js', '.png', '.jpg', '.jpeg',
        '.gif', '.svg', '.ico', '.webp', '.woff',
        '.woff2', '.ttf', '.eot', '.json', '.xml',
        '.txt', '.pdf', '.doc', '.docx'
    ],

    // Rate limiting for public routes
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};