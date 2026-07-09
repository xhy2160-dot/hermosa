import express from 'express';
import db from '../models/index.js';
const { Room } = db;

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;