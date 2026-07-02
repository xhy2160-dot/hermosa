import express from 'express';
import db from '../models/index.js';
const { Treatment, Customer, Staff } = db;

const router = express.Router();
// ============================================
// POST /api/treatment/add
// Create a new treatment
// ============================================
router.post('/add', async (req, res) => {
    try {
        const {
            name,
            date,
            time,
            customer_id,
            staff_id,
            location,
            payment,
            payment_date,
            amount,
            balance,
            remark,
            status
        } = req.body;

        if (!name || !customer_id) {
            return res.status(400).json({
                success: false,
                message: 'Name and customer_id are required'
            });
        }

        // ✅ Validate customer exists
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // ✅ Validate status (if provided)
        if (status && !['in-progress', 'completed', 'cancelled', 'no-show'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: in-progress, completed, cancelled, or no-show'
            });
        }

        // ✅ Create treatment
        const treatment = await Treatment.create({
            name: name.trim(),
            date: date || null,
            time: time || null,
            customer_id: parseInt(customer_id),
            staff_id: staff_id ? parseInt(staff_id) : null,
            location: location || '5075 Yonge St #600, Richmond Hill',
            payment: payment || null,
            payment_date: payment_date || null,
            amount: amount ?? 0,
            balance: balance ?? 0,
            remark: remark || null,
            status: status || 'in-progress'
        });

        res.status(201).json({
            success: true,
            message: 'Treatment created successfully',
            data: treatment
        });

    } catch (error) {
        console.error('Error creating treatment:', error);

        // ✅ Handle specific Sequelize errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer_id. Customer does not exist.'
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry',
                errors: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create treatment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/get-all-by-cusId', async (req, res) => {
    try {
        const { customerId } = req.query;
        console.log('Received customerId query:', req.query);

        const parsedId = parseInt(customerId, 10);
        if (!customerId || isNaN(parsedId)) {
            return res.status(400).json({
                success: false,
                message: 'A valid numerical customerId query parameter is required.'
            });
        }

        // 1. Fetch treatments and eager-load the associated Staff record
        const treatments = await Treatment.findAll({
            where: { customer_id: parsedId },
            include: [
                {
                    model: Staff,
                    as: 'staff', // Matches the association alias defined in your models
                    attributes: ['name'] // Only fetch the name column from the staff table
                }
            ]
        });

        // 2. Iterate (map) through the results to flatten and inject staff_name directly
        const formattedTreatments = treatments.map(treatment => {
            const plainTreatment = treatment.toJSON(); // Convert Sequelize instance to plain JS object

            // Extract the name from the nested object, fallback if staff is missing
            plainTreatment.staff_name = plainTreatment.staff?.name || 'Unknown Staff';

            // Optional: If you explicitly want to delete the old raw staff_id or nested staff object
            // delete plainTreatment.staff_id; 
            delete plainTreatment.staff;

            return plainTreatment;
        });

        res.status(200).json({
            success: true,
            message: 'Treatments retrieved successfully',
            data: formattedTreatments // Sends the flattened iterated array
        });
    } catch (error) {
        console.error('Error fetching treatments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch treatments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;