import express from 'express';
import { Sequelize } from 'sequelize'
import db from '../models/index.js';
const { Treatment, Customer, Staff, Room, Appointment, InstallPayment } = db;

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
        } = req.body;

        if (!name || !customer_id) {
            res.fail('Missing required fields: name and customer_id are required', 400);
        }

        // ✅ Validate customer exists
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            res.fail('Customer not found', 404);
        }

        // ✅ Create treatment
        const treatment = await Treatment.create({
            customer_id,
            name,
            total: total || 0.00,
            remark: remark || null,
            added_by: added_by || null
        });

        res.success(treatment, 'Treatment created successfully', 200);

    } catch (error) {
        console.error('Error creating treatment:', error);
        res.fail('Failed to create treatment', 500);
    }
});

router.get('/get-all-by-cusId', async (req, res) => {
    try {
        const { customerId } = req.query;
        const parsedId = parseInt(customerId, 10);

        // 🔑 修复：加上 return，防止因参数错误导致后面的代码继续执行
        if (!customerId || isNaN(parsedId)) {
            return res.fail('Missing or invalid customerId query parameter', 400);
        }

        // 1. 正常查出 treatments 及其关联的 appointments 的状态
        const treatments = await Treatment.findAll({
            where: { customer_id: parsedId },
            order: [
                // 1. Explicitly qualify status as `Treatment.status` 
                [
                    Sequelize.literal(`CASE WHEN \`Treatment\`.\`status\` = 'in-progress' THEN 0 ELSE 1 END`),
                    'ASC'
                ],
                // 2. Secondary Sort: ID newest first
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
                    model: Appointment,
                    as: 'appointments',
                    attributes: ['status']
                },
                {
                    model: InstallPayment,
                    as: 'payments',
                }
            ]
        });

        // 2. 🚀 核心重构：在 map 里做计算，拍平数据的同时转为计数
        const formattedTreatments = treatments.map(treatment => {
            const plainTreatment = treatment.toJSON();

            // 提取员工姓名
            plainTreatment.staff_name = plainTreatment.staff?.name || 'Unknown Staff';

            // 统计预约数量
            const appointmentsList = plainTreatment.appointments || [];

            plainTreatment.total_appointments = appointmentsList.length; // 总预约数
            plainTreatment.completed_appointments = appointmentsList.filter(
                app => app.status === 'completed'
            ).length; // 已完成的预约数

            const treatmentTotal = parseFloat(treatment.total || 0).toFixed(2);
            const payments = treatment.payments || [];

            // 4. 稳健的数字计算，防范 JS 浮点数相加产生多余小数位 (如 0.1 + 0.2 = 0.30000000004)
            const rawTotalPaid = payments.reduce((sum, item) => {
                return sum + parseFloat(item.amount || 0);
            }, 0);

            plainTreatment.totalPaid = parseFloat(rawTotalPaid.toFixed(2));
            plainTreatment.balance = parseFloat((treatmentTotal - plainTreatment.totalPaid).toFixed(2));

            // ✨ 优雅剥离：删掉没用的嵌套大对象和预约明细数组
            delete plainTreatment.payments;
            delete plainTreatment.staff;
            delete plainTreatment.appointments;

            return plainTreatment;
        });

        res.success(formattedTreatments, 'Treatments retrieved successfully', 200);
    } catch (error) {
        console.error('Error fetching treatments:', error);
        res.fail('Failed to fetch treatments', 500);
    }
});

router.get('/get-all-by-date', async (req, res) => {
    try {
        const { date } = req.query;
        console.log('Received date query:', req.query);


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