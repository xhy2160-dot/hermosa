// routes/staff.js
import express from 'express';
import db from '../models/index.js';
const { Staff } = db;
import bcrypt from 'bcryptjs';
import { formatNAPhoneNumber } from '../utils/formatPhoneNo.js';

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
            return res.fail('Email already registered. Please use a different email address.', 409)
        }

        const normalizedPhone = phone ? formatNAPhoneNumber(phone) : null;

        if (!normalizedPhone) {
            return res.fail('Invalid phone number format!', 409)
        }

        // ✅ Hash password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ✅ Create new staff member
        const newStaff = await Staff.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: normalizedPhone,
            password: hashedPassword,
            role: role || 'staff',
        });

        // ✅ Return response without password
        const staffResponse = newStaff.toJSON();
        delete staffResponse.password;

        res.success(staffResponse, 'Staff member added successfully', 201)

    } catch (error) {
        console.error('Error adding staff:', error)
        return res.fail('Internal server error', 500)
    }
});

router.post('/update', async (req, res) => {
    try {
        const { id, name, email, phone, role, status, password } = req.body;

        // ✅ Find the staff member by ID
        const staffMember = await Staff.findByPk(id);
        if (!staffMember) {
            return res.fail('Staff member not found', 404)
        }

        // ✅ Check if email is being updated and if it already exists
        if (email && email !== staffMember.email) {
            const existingStaff = await Staff.findOne({
                where: { email: email.toLowerCase().trim() }
            });
            if (existingStaff) {
                return res.fail('Email already registered. Please use a different email address', 409)
            }
        }

        const normalizedPhone = phone ? formatNAPhoneNumber(phone) : null;

        if (!normalizedPhone) {
            return res.fail('Invalid phone number format!', 409)
        }

        // ✅ Update the staff member
        await staffMember.update({
            name: name ? name.trim() : staffMember.name,
            email: email ? email.toLowerCase().trim() : staffMember.email,
            phone: normalizedPhone,
            role: role || staffMember.role,
            status: status !== undefined ? status : staffMember.status,
            password: password ? await bcrypt.hash(password, 10) : staffMember.password
        });

        // ✅ Return updated staff member without password
        const updatedStaff = staffMember.toJSON();
        delete updatedStaff.password;

        res.success(updatedStaff, 'Staff member updated successfully', 200)

    } catch (error) {
        console.error('Error updating staff:', error);
        return res.fail('Internal server error', 500)
    }
});

export default router;