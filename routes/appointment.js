import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
const { Appointment, Customer, Treatment, Staff, Room } = db;

const router = express.Router();

router.get('/get-all-by-date', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            res.fail('A valid date query parameter is required.', 400);
        }

        // 1. Fetch treatments and eager-load the associated Staff record
        const appointments = await Appointment.findAll({
            where: {
                date: date,
                status: {
                    [Op.ne]: 'cancelled' // 👈 Adds status != 'cancelled'
                }
            },
            include: [
                {
                    model: Staff,
                    as: 'staff', // Matches the association alias defined in your models
                    attributes: ['name'] // Only fetch the name column from the staff table
                },
                {
                    model: Room,
                    as: 'room_name', // Matches the association alias defined in your models
                    attributes: ['name'] // Only fetch the name column from the room table
                },
                {
                    model: Treatment,
                    as: 'treatment', // Matches the association alias defined in your models
                    attributes: ['name', 'customer_id'], // Only fetch the name column from the treatment table
                    include: [
                        // 🚀 在这里嵌套关联 Customer
                        {
                            model: Customer,
                            as: 'customer', // 确保这个别名与 Treatment 和 Customer 之间定义的关联一致
                            attributes: ['name', 'phone', 'email'] // 提取客户详情
                        }
                    ]
                }
            ]
        });

        const flattenedAppointments = appointments.map(app => {
            // 将 Sequelize 实例转换为纯 JavaScript 对象
            const { staff, room_name, treatment, ...baseInfo } = app.get({ plain: true });

            return {
                ...baseInfo, // 自动保留 id, title, date, start_time, location, room, remark 等所有基础字段

                // 拍平 staff 和 room
                staff_name: staff?.name || null,
                room_title: room_name?.name || null, // 避免和基础字段中的 room 冲突，这里命名为 room_title

                // 拍平 treatment 及其嵌套的 customer
                treatment_name: treatment?.name || null,
                customer_id: treatment?.customer_id || null,
                customer_name: treatment?.customer?.name || null,
                customer_phone: treatment?.customer?.phone || null,
                customer_email: treatment?.customer?.email || null
            };
        });

        res.success(flattenedAppointments, 'Appointments retrieved successfully', 200); // Use the success method from responseHandler
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.fail('Failed to fetch appointments', 500); // Use the fail method from responseHandler
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
                    model: Treatment,
                    as: 'treatment',
                    attributes: ['name']
                }
            ]
        });

        const flattenedAppointments = appointments.map(app => {
            const { staff, room_name, treatment, ...baseInfo } = app.get({ plain: true });

            return {
                ...baseInfo,
                staff_name: staff?.name || null,
                room_name: room_name?.name || null,
                treatment_name: treatment?.name || null
            };
        });

        res.success(flattenedAppointments, 'Appointments retrieved successfully', 200);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.fail('Failed to fetch appointments', 500);
    }
});

router.post('/add', async (req, res) => {
    try {
        const {
            room_id,
            staff_id,
            customer_id,
            location,
            treatment_id,
            date,
            start_time,
            end_time,
            remark,
        } = req.body;

        if (!treatment_id || !customer_id) {
            res.fail('Missing required fields: treatment and customer_id are required', 400);
        }

        // ✅ Validate customer exists
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            res.fail('Customer not found', 404);
        }

        // ✅ Create treatment
        const appointment = await Appointment.create({
            room: room_id,
            assigned_staff: staff_id,
            customer_id,
            location,
            treatment_id,
            date,
            start_time,
            end_time,
            title: 'tbd',
            remark,
        });

        res.success(appointment, 'appointment created successfully', 201); // Use the success method from responseHandler

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.fail('Failed to create appointment', 500); // Use the fail method from responseHandler

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
            assigned_staff,
            treatment_id,
            status,
        } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.fail('Appointment not found', 404);
        }

        await appointment.update({
            room,
            assigned_staff,
            location,
            date,
            start_time,
            end_time,
            treatment_id,
            remark,
            status: status || appointment.status, // Keep existing status if not provided
        });

        res.success(appointment, 'Appointment updated successfully', 200);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.fail('Failed to update appointment', 500);
    }
});

export default router;