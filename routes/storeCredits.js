import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { calcStoreCreditBalance } from '../utils/storeCredits.js';
const { InstallPayment, Treatment, Appointment, StoreCredit } = db;


const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { customerId } = req.query;
        const parsedId = parseInt(customerId, 10);

        if (!customerId || isNaN(parsedId)) {
            return res.fail('Missing or invalid customerId query parameter', 400);
        }

        const balance = await calcStoreCreditBalance(parsedId);

        return res.success({
            balance
        }, 'Store credit balance retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching store credit balances:', error);
        return res.fail('Failed to fetch store credit balances', 500);
    }
});


router.post('/update', async (req, res) => {
    try {
        const {
            amount,
            customer_id,
            staff_name,
            type,
            remark
        } = req.body;


        if ((isNaN(parseFloat(amount)))) {
            res.fail('Missing or invalid amount', 400);
        }

        await StoreCredit.create({
            amount,
            customer_id,
            staff_name,
            type,
            remark
        });

        const balance = await calcStoreCreditBalance(customer_id);

        res.success({ balance }, 'Store credit created successfully', 201);
    } catch (error) {
        console.error('Error creating store credit:', error);
        res.fail('Failed to create store credit', 500);
    }
});

export default router;