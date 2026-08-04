import express from 'express';
import { Sequelize, Op } from 'sequelize'
import db from '../models/index.js';
const { sequelize, Treatment, Customer, Staff, Room, Appointment, InstallPayment } = db;

const router = express.Router();
// ============================================
// POST /api/treatment/add
// Create a new treatment
// ============================================

router.post('/add', async (req, res) => {
    try {
        const {
            customer_id,
            name,
            total,
            remark,
            added_by,
            payment_method,
            total_sessions,
        } = req.body;

        // 1. Validation check with immediate return
        if (!name || !customer_id) {
            return res.fail('Missing required fields: name and customer_id are required', 400);
        }

        // 2. Wrap all database operations inside a managed transaction
        const result = await sequelize.transaction(async (t) => {
            // Validate customer exists within transaction
            const customer = await Customer.findByPk(customer_id, { transaction: t });
            if (!customer) {
                return { error: 'Customer not found', statusCode: 404 };
            }

            // Create treatment record
            const treatment = await Treatment.create({
                customer_id,
                name,
                total: total || 0.00,
                remark: remark || null,
                added_by: added_by || null,
                total_sessions: total_sessions || 1
            }, { transaction: t });

            // Create initial payment record
            await InstallPayment.create({
                treatment_id: treatment.id,
                type: 'initial',
                amount: parseFloat(total) || 0.00,
                payment_method: payment_method || null,
            }, { transaction: t });

            return { treatment };
        });

        // Check if transaction callback returned an early failure state
        if (result.error) {
            return res.fail(result.error, result.statusCode);
        }

        return res.success(result.treatment, 'Treatment created successfully', 201);

    } catch (error) {
        console.error('Error creating treatment:', error);
        return res.fail('Failed to create treatment', 500);
    }
});

router.get('/get-all-by-cusId', async (req, res) => {
    try {
        const { customerId } = req.query;
        const parsedId = parseInt(customerId, 10);

        if (!customerId || isNaN(parsedId)) {
            return res.fail('Missing or invalid customerId query parameter', 400);
        }

        // 1. Query treatments with staff, direct payments, and nested appointment payments
        const treatments = await Treatment.findAll({
            where: { customer_id: parsedId },
            order: [
                [
                    Sequelize.literal(`CASE WHEN \`Treatment\`.\`status\` = 'in-progress' THEN 0 ELSE 1 END`),
                    'ASC'
                ],
                ['id', 'DESC']
            ],
            limit: 100,
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['name']
                },
                {
                    model: InstallPayment,
                    as: 'payments' // Initial treatment payments
                },
                {
                    model: Appointment,
                    as: 'appointments',
                    attributes: ['id', 'status'],
                    include: [
                        {
                            model: InstallPayment,
                            as: 'payments',
                            where: {
                                type: {
                                    [Op.ne]: 'initial' // 🌟 Excludes any InstallPayment with type = 'initial'
                                }
                            },
                            required: false
                        }
                    ]
                }
            ]
        });



        // 2. Format treatments and compute accurate totals
        const formattedTreatments = treatments.map(treatment => {
            const plainTreatment = treatment.toJSON();
            // Format staff name
            plainTreatment.staff_name = plainTreatment.staff?.name || 'Unknown Staff';

            // Appointment counts
            const appointmentsList = plainTreatment.appointments || [];
            plainTreatment.total_appointments = appointmentsList.length;
            plainTreatment.completed_appointments = appointmentsList.filter(
                app => app.status === 'completed'
            ).length;

            const treatmentTotal = parseFloat(plainTreatment.total || 0);

            // 🌟 3. Calculate Initial Treatment Payments (treatment_id === treatment.id)
            const initialPayments = plainTreatment.payments || [];
            console.log('Initial Payments:', initialPayments);
            const initialPaidSum = initialPayments.reduce((sum, p) => {
                const amount = parseFloat(p.amount || 0);
                return p.type === 'initial' ? sum + amount : sum - amount;
            }, 0);

            // 🌟 4. Calculate Appointment Payments across all appointments for this treatment
            let appointmentPaidSum = 0;
            appointmentsList.forEach(app => {
                const appPayments = app.payments || [];
                appPayments.forEach(payment => {
                    const amount = parseFloat(payment.amount || 0);
                    // Deduct or add based on treatment_id logic (if appointment payments reduce balance)
                    appointmentPaidSum += amount;

                });
            });
            plainTreatment.appUsed = appointmentPaidSum
            plainTreatment.balance = parseFloat((initialPaidSum - appointmentPaidSum).toFixed(2));

            // Clean up unwanted internal objects before returning to frontend
            delete plainTreatment.payments;
            delete plainTreatment.staff;
            delete plainTreatment.appointments;

            return plainTreatment;
        });

        return res.success(formattedTreatments, 'Treatments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching treatments:', error);
        return res.fail('Failed to fetch treatments', 500);
    }
});

router.get('/get-all-by-date', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'A valid date query parameter is required.'
            });
        }

        // 1. Fetch treatments and eager-load the associated Staff record
        const treatments = await Treatment.findAll({
            where: { date: date },
            include: [
                {
                    model: Staff,
                    as: 'staff', // Matches the association alias defined in your models
                    attributes: ['name'] // Only fetch the name column from the staff table
                },
                {
                    model: Room,
                    as: 'room', // Matches the association alias defined in your models
                    attributes: ['name'] // Only fetch the name column from the room table
                },
                {
                    model: Customer,
                    as: 'customer', // Matches the association alias defined in your models
                    attributes: ['name', 'phone'] // Only fetch the name and phone columns from the customer table
                }
            ]
        });

        // 2. Iterate (map) through the results to flatten and inject staff_name directly
        const formattedTreatments = treatments.map(treatment => {
            const plainTreatment = treatment.toJSON(); // Convert Sequelize instance to plain JS object

            // Extract the name from the nested object, fallback if staff is missing
            plainTreatment.staff_name = plainTreatment.staff?.name || 'Unknown Staff';
            plainTreatment.room_name = plainTreatment.room ? plainTreatment.room.name : null;
            plainTreatment.customer_name = plainTreatment.customer?.name || 'Unknown Customer';
            plainTreatment.customer_phone = plainTreatment.customer?.phone || 'Unknown Phone';

            // Optional: If you explicitly want to delete the old raw staff_id or nested staff object
            // delete plainTreatment.staff_id; 
            delete plainTreatment.staff;
            delete plainTreatment.room;
            delete plainTreatment.customer;

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

router.put('/update', async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const treatment = await Treatment.findByPk(id);
        if (!treatment) {
            return res.status(404).json({
                success: false,
                message: 'Treatment not found'
            });
        }
        await treatment.update(updateData);
        res.status(200).json({
            success: true,
            message: 'Treatment updated successfully',
            data: treatment
        });
    } catch (error) {
        console.error('Error updating treatment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update treatment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


export default router;