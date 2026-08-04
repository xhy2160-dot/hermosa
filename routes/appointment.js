import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
const { sequelize, Appointment, Customer, Treatment, Staff, Room, InstallPayment } = db;
import { addALog } from '../utils/addActivityLog.js';

const router = express.Router();

router.get('/get-all-by-date', async (req, res) => {
    try {
        const { date } = req.query;

        // 🌟 FIX 1: Added return to stop execution if date is missing
        if (!date) {
            return res.fail('A valid date query parameter is required.', 400);
        }

        // 1. Fetch appointments with associated Staff, Room, and Customer records
        const appointments = await Appointment.findAll({
            where: {
                date: date,
                status: {
                    [Op.ne]: 'cancelled'
                }
            },
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['name']
                },
                {
                    model: Room,
                    as: 'room_name',
                    attributes: ['name']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'phone', 'email'] // Added 'id' here for customer_id mapping
                }
            ]
        });

        // 🌟 FIX 2: Batch fetch Treatments without direct model association
        // Extract non-null unique treatment IDs from the appointments list
        const treatmentIds = [...new Set(
            appointments
                .map(app => app.treatment_id)
                .filter(id => id !== 0)
        )];

        // Fetch all related treatments in 1 single query
        let treatmentMap = {};
        if (treatmentIds.length > 0) {
            const treatments = await Treatment.findAll({
                where: {
                    id: {
                        [Op.in]: treatmentIds
                    }
                },
                attributes: ['id', 'name']
            });

            // Create a fast lookup map: { treatment_id: treatment_name }
            treatmentMap = treatments.reduce((acc, t) => {
                acc[t.id] = t.name;
                return acc;
            }, {});
        }

        // 🌟 FIX 3: Safely map and flatten the response
        const flattenedAppointments = appointments.map(app => {
            // Safely convert to plain JS object and separate nested models
            const { staff, room_name, customer, ...baseInfo } = app.get({ plain: true });

            return {
                ...baseInfo, // Retains id, date, start_time, location, remark, treatment_id, etc.

                // Flatten staff & room
                staff_name: staff?.name || null,
                room_title: room_name?.name || null,

                // Lookup treatment name from our batch dictionary
                treatment_name: baseInfo.treatment_id ? (treatmentMap[baseInfo.treatment_id] || null) : null,

                // Flatten customer details (fixed undefined customer bug)
                customer_id: customer?.id || null,
                customer_name: customer?.name || null,
                customer_phone: customer?.phone || null,
                customer_email: customer?.email || null
            };
        });

        return res.success(flattenedAppointments, 'Appointments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.fail('Failed to fetch appointments', 500);
    }
});

router.get('/get-all-by-customerId', async (req, res) => {
    try {
        const { customerId } = req.query;
        const parsedId = parseInt(customerId, 10);

        // 🌟 1. FIX: Proper validation and accurate error message
        if (!customerId || isNaN(parsedId)) {
            return res.fail('Missing or invalid customerId query parameter', 400);
        }

        // 2. Fetch appointments
        const appointments = await Appointment.findAll({
            where: { customer_id: parsedId },
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['name']
                },
                {
                    model: Room,
                    as: 'room_name',
                    attributes: ['name']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'phone', 'email']
                }
            ]
        });

        if (!appointments || appointments.length === 0) {
            return res.success([], 'No appointments found for this customer', 200);
        }

        // 🌟 3. FIX: Batch fetch all payments in ONE single database query
        const appointmentIds = appointments.map(app => app.id);
        const payments = await InstallPayment.findAll({
            where: {
                appointment_id: {
                    [Op.in]: appointmentIds
                }
            }
        });

        // Group payments by appointment_id into a lookup object for O(1) performance
        // Example: { 101: [payment1, payment2], 102: [payment3] }
        const paymentsByAppointment = payments.reduce((acc, payment) => {
            const appId = payment.appointment_id;
            if (!acc[appId]) acc[appId] = [];
            acc[appId].push(payment);
            return acc;
        }, {});

        // 🌟 4. FIX: Synchronous mapping (No unhandled async/promises)
        const flattenedAppointments = appointments.map(app => {
            const { staff, room_name, customer, ...baseInfo } = app.get({ plain: true });

            // Calculate total paid for this specific appointment
            const appPayments = paymentsByAppointment[baseInfo.id] || [];
            let total = 0;

            appPayments.forEach(payment => {
                const amount = parseFloat(payment.amount || 0);

                // 🌟 Cast to Number to prevent "0" === 0 type mismatch failures
                if (Number(payment.treatment_id) === 0) {
                    total += amount;
                } else {
                    total += amount;
                    total = 0 - total; // Ensure total doesn't go negative due to overpayment
                }
            });

            // 🌟 Clean up -0 floating point quirks before returning
            const formattedTotal = Math.abs(total) < 0.00001 ? 0 : parseFloat(total.toFixed(2));

            return {
                ...baseInfo,
                staff_name: staff?.name || null,
                room_name: room_name?.name || null,
                treatment_name: app.title || null,
                customer_id: customer?.id || null,
                customer_name: customer?.name || null,
                customer_phone: customer?.phone || null,
                customer_email: customer?.email || null,
                total_paid: formattedTotal
            };
        });

        return res.success(flattenedAppointments, 'Appointments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching appointments by customer ID:', error);
        return res.fail('Failed to fetch appointments', 500);
    }
});

router.get('/get-all-by-treatmentId', async (req, res) => {
    console.log('Received query parameters:', req.query);
    try {
        const { treatmentId } = req.query;
        const parsedId = parseInt(treatmentId, 10);

        if (!treatmentId || isNaN(parsedId)) {
            return res.fail('Missing or invalid treatmentId query parameter', 400);
        }

        // 1. Fetch the treatment record once directly
        const treatmentRecord = await Treatment.findByPk(parsedId, {
            attributes: ['name']
        });
        const treatmentName = treatmentRecord?.name || null;

        // 2. Fetch appointments (without Treatment eager loading)
        const appointments = await Appointment.findAll({
            where: { treatment_id: parsedId },
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['name']
                },
                {
                    model: Room,
                    as: 'room_name',
                    attributes: ['name']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'name', 'phone', 'email'] // Added Customer if needed by frontend
                }
            ]
        });

        // 3. Flatten and attach staff, room, customer, and the pre-fetched treatment_name
        const flattenedAppointments = appointments.map(app => {
            const { staff, room_name, customer, ...baseInfo } = app.get({ plain: true });

            return {
                ...baseInfo,
                staff_name: staff?.name || null,
                room_name: room_name?.name || null,
                treatment_name: treatmentName, // 👈 Attached safely here
                customer_id: customer?.id || null,
                customer_name: customer?.name || null,
                customer_phone: customer?.phone || null,
                customer_email: customer?.email || null
            };
        });

        return res.success(flattenedAppointments, 'Appointments retrieved successfully', 200);
    } catch (error) {
        console.error('Error fetching appointments by treatment ID:', error);
        return res.fail('Failed to fetch appointments', 500);
    }
});

router.post('/add', async (req, res) => {
    try {
        // 🌟 1. FIX: Declare treatment_name with 'let' so it can be safely modified
        let {
            room_id,
            staff_id,
            customer_id,
            location,
            date,
            start_time,
            end_time,
            remark,
            staffName,
            treatment_name,
            treatment_id
        } = req.body;

        // 🌟 2. FIX: Added return statement after response
        if (!customer_id) {
            return res.fail('Missing required fields: customer_id is required', 400);
        }

        // ✅ Validate customer exists
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            return res.fail('Customer not found', 404);
        }

        if (!treatment_id) {
            treatment_id = 0;
        } else {
            // Count existing appointments for this treatment
            const count = await Appointment.count({ where: { treatment_id } });

            // 🌟 3. FIX: Fetch treatment and access total_sessions correctly
            const treatment = await Treatment.findOne({
                where: { id: treatment_id },
                attributes: ['total_sessions', 'name']
            });

            const total = treatment?.total_sessions || 1;
            const currentSession = count + 1;

            treatment_name = `${treatment.name || 'Treatment'} (${currentSession}/${total})`;
        }

        // ✅ Create appointment
        const appointment = await Appointment.create({
            room: room_id,
            assigned_staff: staff_id,
            customer_id,
            location,
            treatment_id,
            date,
            start_time,
            end_time,
            title: treatment_name,
            remark,
        });

        await addALog('added', staffName, 'added a new appointment for', `${customer.name} at ${date} ${start_time}`);

        return res.success(appointment, 'Appointment created successfully', 201);

    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.fail('Failed to create appointment', 500);
    }
});

router.put('/update', async (req, res) => {
    try {
        const {
            id,
            date,
            start_time,
            end_time,
            location,
            remark,
            room,
            staff_id,
            status,
            staffName,
            treatment_name,
            title
        } = req.body;

        let { treatment_id } = req.body;

        // 🌟 1. Use a Managed Transaction (automatically commits on success, rolls back on error)
        const result = await sequelize.transaction(async (t) => {
            // Find appointment inside transaction
            const appointment = await Appointment.findByPk(id, { transaction: t });
            if (!appointment) {
                return { error: 'Appointment not found', statusCode: 404 };
            }

            // Determine final status
            const updatedStatus = status || appointment.status;
            const targetTreatmentId = treatment_id || 0;

            // Build unified update payload
            const updateData = {
                room,
                assigned_staff: staff_id,
                location,
                date,
                start_time,
                end_time,
                remark,
                status: updatedStatus,
                treatment_id: targetTreatmentId,
            };

            // Set title conditionally based on treatment_id presence
            if (!targetTreatmentId) {
                updateData.title = treatment_name || title || appointment.title;
            }

            // 🌟 2. Update Appointment within transaction
            await appointment.update(updateData, { transaction: t });

            // 🌟 3. Handle Treatment Completion logic if associated with a treatment
            if (targetTreatmentId > 0) {
                // Count all completed appointments for this treatment
                const count = await Appointment.count({
                    where: {
                        treatment_id: targetTreatmentId,
                        status: 'completed'
                    },
                    transaction: t
                });

                const treatment = await Treatment.findOne({
                    where: { id: targetTreatmentId },
                    attributes: ['id', 'total_sessions', 'status'],
                    transaction: t
                });

                if (treatment) {
                    const total = treatment.total_sessions || 1;

                    // If total completed appointments reaches or exceeds total required sessions
                    if (count >= total) {
                        // 🌟 FIX: Added quotes around 'completed' and added await
                        await treatment.update(
                            { status: 'completed' },
                            { transaction: t }
                        );
                    }
                }
            }

            // 🌟 4. Log inside transaction (if addALog supports transaction passing)
            await addALog(
                'edited',
                staffName,
                'edited an appointment',
                `at ${date} ${start_time}`,
                { transaction: t } // Pass transaction if addALog accepts options
            );

            return { appointment };
        });

        // Check if the transaction callback returned an early failure state
        if (result.error) {
            return res.fail(result.error, result.statusCode);
        }

        return res.success(result.appointment, 'Appointment updated successfully', 200);

    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.fail('Failed to update appointment', 500);
    }
});

export default router;