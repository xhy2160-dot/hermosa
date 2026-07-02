// routes/staff.js
import express from 'express';
import db from '../models/index.js';
const { Staff } = db;
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET: /api/staff
router.get('/get-all-staff', async (req, res) => {
    try {
        // ✅ Exclude password field
        const staff = await Staff.findAll({
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch staff members',
            error: error.message
        });
    }
});

// POST: /api/staff/add
router.post('/add', async (req, res) => {
    try {
        const { name, email, phone, password, role, status } = req.body;

        // ✅ Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // ✅ Check if email already exists
        const existingStaff = await Staff.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (existingStaff) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please use a different email address.',
                code: 'EMAIL_EXISTS'
            });
        }


        // ✅ Hash password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ✅ Create new staff member
        const newStaff = await Staff.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : null,
            password: hashedPassword,
            role: role || 'staff',
        });

        // ✅ Return response without password
        const staffResponse = newStaff.toJSON();
        delete staffResponse.password;

        res.status(201).json({
            success: true,
            message: 'Staff member added successfully',
            data: staffResponse
        });

    } catch (error) {
        console.error('Error adding staff:', error);

        // ✅ Handle specific Sequelize errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Email or phone already exists',
                code: 'DUPLICATE_ENTRY'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors.map(e => e.message).join(', '),
                code: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
});

router.post('/update', async (req, res) => {
    console.log('Update request body:', req.body); // Log the request body for debugging
    try {
        const { id, name, email, phone, role, status, password } = req.body;

        // ✅ Find the staff member by ID
        const staffMember = await Staff.findByPk(id);
        if (!staffMember) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // ✅ Check if email is being updated and if it already exists
        if (email && email !== staffMember.email) {
            const existingStaff = await Staff.findOne({
                where: { email: email.toLowerCase().trim() }
            });
            if (existingStaff) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered. Please use a different email address.',
                    code: 'EMAIL_EXISTS'
                });
            }
        }

        // ✅ Update the staff member
        await staffMember.update({
            name: name ? name.trim() : staffMember.name,
            email: email ? email.toLowerCase().trim() : staffMember.email,
            phone: phone ? phone.trim() : staffMember.phone,
            role: role || staffMember.role,
            status: status !== undefined ? status : staffMember.status,
            password: password ? await bcrypt.hash(password, 10) : staffMember.password
        });

        // ✅ Return updated staff member without password
        const updatedStaff = staffMember.toJSON();
        delete updatedStaff.password;

        res.status(200).json({
            success: true,
            message: 'Staff member updated successfully',
            data: updatedStaff
        });

    } catch (error) {
        console.error('Error updating staff:', error);

        // ✅ Handle specific Sequelize errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Email or phone already exists',
                code: 'DUPLICATE_ENTRY'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors.map(e => e.message).join(', '),
                code: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
});

export default router;