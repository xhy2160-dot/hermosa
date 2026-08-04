import { Op } from 'sequelize';
import db from '../models/index.js';
const { StoreCredit } = db;

export const calcStoreCreditBalance = async (customer_id) => {
    const credits = await StoreCredit.findAll({
        where: { customer_id },
        attributes: ['amount'],
        raw: true
    });
    const total = credits.reduce((sum, credit) => sum + (parseFloat(credit.amount) || 0), 0);
    return parseFloat(total.toFixed(2));
};