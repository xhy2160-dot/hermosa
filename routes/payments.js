import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { calcStoreCreditBalance } from '../utils/storeCredits.js';

const { sequelize, InstallPayment, Treatment, Appointment, StoreCredit } = db;

const router = express.Router();

router.get('/get-all-by-appointmentId', async (req, res) => {
    try {
        const { appId } = req.query;
        const parsedId = parseInt(appId, 10); // 补全 10 进制参数，防范旧浏览器/环境解析漏洞

        if (!appId || isNaN(parsedId)) {
            return res.fail('Missing or invalid appointmentId query parameter', 400);
        }

        const payments = await InstallPayment.findAll({
            where: { appointment_id: parsedId },
        });

        // 5. 🎯 修复响应：结构清晰，payments 以正常的数组结构交付给前端
        res.success({
            payments // 保持标准的 Array 数组格式
        }, 'payments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching payments:', error);
        res.fail('Failed to fetch payments', 500);
    }
});

router.get('/get-all-by-treatmentId', async (req, res) => {
    try {
        const { treatmentId } = req.query;
        const parsedId = parseInt(treatmentId, 10);

        // 1. Validate query parameter
        if (!treatmentId || isNaN(parsedId)) {
            return res.fail('Missing or invalid treatmentId query parameter', 400);
        }

        // 2. Fetch initial payment record safely
        const initialPayment = await InstallPayment.findAll({
            where: { treatment_id: parsedId },
        });

        // 3. Find all appointment records for this treatment_id
        const appointments = await Appointment.findAll({
            where: { treatment_id: parsedId },
            attributes: ['id']
        });

        let formattedPayments = [];

        // 4. Fetch appointment payments if appointments exist
        if (appointments && appointments.length > 0) {
            const appointmentIds = appointments.map(app => app.id);

            const payments = await InstallPayment.findAll({
                where: {
                    appointment_id: {
                        [Op.in]: appointmentIds
                    }
                }
            });

            formattedPayments = payments.map(payment => {
                const plainPayment = payment.get({ plain: true });
                const rawAmount = parseFloat(plainPayment.amount || 0);

                // Negate amount if treatment_id is 0 (or adjust logic as needed)
                const finalAmount = Number(plainPayment.treatment_id) === 0
                    ? -rawAmount
                    : rawAmount;

                return {
                    ...plainPayment,
                    amount: parseFloat(finalAmount.toFixed(2))
                };
            });
        }

        // 🌟 5. FIX: Safely unshift initialPayment if it exists
        if (initialPayment.length > 0) {
            initialPayment.map(p => {
                if (p.type === 'conversion') {
                    p.amount = 0 - (parseFloat(p.amount || 0)).toFixed(2);
                    formattedPayments.push(p.get({ plain: true }));
                } else if (p.type === 'initial') {
                    p.amount = (parseFloat(p.amount || 0)).toFixed(2);
                    formattedPayments.unshift(p.get({ plain: true }));
                }
            });
        }
        // 6. Return success response
        return res.success({
            payments: formattedPayments
        }, 'Payments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching payments by treatment ID:', error);
        return res.fail('Failed to fetch payments', 500);
    }
});

router.post('/add', async (req, res) => {
    try {
        const {
            id,
            type,
            amount,
            payment_method,
            flag,
            staff_name
        } = req.body;

        // 1. Validation checks with immediate returns
        if (!id) {
            return res.fail('Missing required fields: id is required', 400);
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.fail('Missing or invalid amount. Amount must be greater than 0', 400);
        }

        if (!['package', 'treatment', 'appointment'].includes(flag)) {
            return res.fail('Invalid flag parameter. Must be "treatment" or "appointment"', 400);
        }

        const targetId = parseInt(id, 10);
        const isStoreCredit = payment_method && payment_method.toLowerCase() === 'store credits';

        // 2. Wrap all database operations inside a managed transaction
        const result = await sequelize.transaction(async (t) => {
            let payment = null;
            if (flag === 'package' && payment_method.toLowerCase() === 'store credits') {
                const treatment = await Treatment.findByPk(targetId, { transaction: t });
                payment = await InstallPayment.create({
                    treatment_id: targetId,
                    type: 'conversion',
                    amount: parsedAmount,
                    payment_method
                }, { transaction: t }); // Placeholder for any package-specific logic
                await StoreCredit.create({
                    associated_id: targetId,
                    type: 'treatment', // Standardized ENUM type
                    staff_name: staff_name || null,
                    amount: parsedAmount,
                    remark: 'Converted treatment balance to store credit',
                    customer_id: treatment.customer_id // Adjust as needed if customer_id is available
                }, { transaction: t });
            }
            else
                if (flag === 'treatment') {
                    // Create installment payment for treatment
                    payment = await InstallPayment.create({
                        appointment_id: targetId,
                        type,
                        amount: parsedAmount,
                        payment_method
                    }, { transaction: t });

                } else if (flag === 'appointment') {
                    // Verify appointment exists
                    const appointment = await Appointment.findByPk(targetId, { transaction: t });
                    if (!appointment) {
                        return { error: 'Appointment not found', statusCode: 404 };
                    }

                    // Handle store credit payment method
                    if (isStoreCredit) {
                        // Pass transaction `t` to balance calculator if supported
                        const balance = await calcStoreCreditBalance(appointment.customer_id);

                        if (balance < parsedAmount) {
                            return { error: 'Insufficient store credit balance', statusCode: 400 };
                        }

                        // Deduct store credit
                        await StoreCredit.create({
                            amount: -parsedAmount,
                            customer_id: appointment.customer_id,
                            associated_id: appointment.id,
                            staff_name: staff_name || null,
                            type: 'appointment' // Standardized ENUM type ('use' or 'appointment')
                        }, { transaction: t });
                    }

                    // Create payment record for appointment
                    payment = await InstallPayment.create({
                        appointment_id: targetId,
                        type,
                        amount: parsedAmount,
                        payment_method
                    }, { transaction: t });
                }

            return { payment };
        });

        // Check if transaction returned a custom early failure
        if (result.error) {
            return res.fail(result.error, result.statusCode);
        }

        return res.success(result.payment, 'Payment saved successfully', 201);

    } catch (error) {
        console.error('Error creating payment:', error);
        return res.fail('Failed to save payment', 500);
    }
});

router.put('/update', async (req, res) => {
    try {
        const {
            id,
            appointment_id,
            payment_method,
            treatment_id,
            type,
            amount
        } = req.body;

        if (!id) {
            res.fail('Missing required fields: id is required', 400);
        }
        if ((parseFloat(amount) < 0 || isNaN(parseFloat(amount)))) {
            res.fail('Missing or invalid amount', 400);
        }

        const payment = await InstallPayment.findByPk(id);
        if (!payment) {
            return res.fail('Payment not found', 404);
        }

        await payment.update({
            id,
            appointment_id,
            payment_method,
            treatment_id,
            type,
            amount
        });

        res.success(payment, 'Payment updated successfully', 200);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.fail('Failed to update payment', 500);
    }
});

export default router;