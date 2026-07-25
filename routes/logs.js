import express from 'express';
import db from '../models/index.js';
const { ActivityLog } = db;

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // 1. Parse and sanitize query parameters with fallbacks
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10)); // Cap limit at 100
        const offset = (page - 1) * limit;

        // 2. Fetch records and total count concurrently
        const { count, rows } = await ActivityLog.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']], // Fetch newest logs first
        });

        res.success({
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }, 'success', 200)
    } catch (error) {
        console.error('Error fetching logs:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch activity logs',
        });
    }
});


export default router;