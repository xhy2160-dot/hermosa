// routes/customers.js
import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
const { Customer } = db;
import { authenticate } from '../middleware/auth.js';
import { formatNAPhoneNumber } from '../utils/formatPhoneNo.js';

const router = express.Router();

// ✅ Create a new customer
router.post('/add', authenticate, async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            preferred_location,
            preferred_doctor,
            preferred_day,
            preferred_time,
            preferred_contact,
            reminder,
            language,
            notes
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.fail('Missing required fields: name, email, and phone are required', 400);
        }

        if (formatNAPhoneNumber(phone) === null) {
            return res.fail('Invalid phone number format', 400);
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : null;
        const normalizedPhone = phone ? formatNAPhoneNumber(phone) : null;

        // 2. Build dynamic OR query based on what values were provided
        const searchCriteria = [];
        if (normalizedEmail) searchCriteria.push({ email: normalizedEmail });
        if (normalizedPhone) searchCriteria.push({ phone: normalizedPhone });

        if (searchCriteria.length > 0) {
            const existingCustomer = await Customer.findOne({
                where: {
                    [Op.or]: searchCriteria
                }
            });

            if (existingCustomer) {
                // Determine exactly which field caused the collision for a better error message
                const isEmailDup = normalizedEmail && existingCustomer.email === normalizedEmail;
                const isPhoneDup = normalizedPhone && existingCustomer.phone === normalizedPhone;

                let message = 'Customer already exists';
                if (isEmailDup && isPhoneDup) message = 'Customer with this email and phone number already exists';
                else if (isEmailDup) message = 'Customer with this email already exists';
                else if (isPhoneDup) message = 'Customer with this phone number already exists';

                return res.fail(message, 409);
            }
        }

        // Create customer
        const customer = await Customer.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: normalizedPhone,
            preferred_location: preferred_location,
            preferred_doctor: preferred_doctor || null,
            preferred_day: preferred_day || null,
            preferred_time: preferred_time || null,
            preferred_contact: preferred_contact || 'email',
            reminder_type: reminder || '24 hour',
            language: language || 'EN',
            notes: notes || null,
            status: 'active'
        });

        return res.success(customer, 'Customer created successfully', 201)

    } catch (error) {
        console.error('Error creating customer:', error);
        res.fail('Internal server error', 500)
    }
});
// routes/customers.js

// ✅ Update customer
router.put('/update', authenticate, async (req, res) => {
    try {
        const {
            id,
            name,
            email,
            phone,
            preferred_location,
            preferred_doctor,
            preferred_day,
            preferred_time,
            preferred_contact,
            reminder,
            language,
            notes,
            status
        } = req.body;

        const customer = await Customer.findByPk(id);

        if (!customer) {
            res.fail('Customer not found', 404)
        }

        // Check email uniqueness if email is being updated
        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({
                where: { email: email.toLowerCase().trim() }
            });
            if (existingEmail) {
                res.fail('Email already in use', 404)
            }
        }

        // Check phone uniqueness if phone is being updated
        if (phone && phone !== customer.phone) {
            const existingPhone = await Customer.findOne({
                where: { phone: phone.trim() }
            });
            if (existingPhone) {
                res.fail('Phone already in use', 404)
            }
        }

        // Update customer
        await customer.update({
            name: name || customer.name,
            email: email ? email.toLowerCase().trim() : customer.email,
            phone: phone || customer.phone,
            preferred_location: preferred_location !== undefined ? preferred_location : customer.preferred_location,
            preferred_doctor: preferred_doctor !== undefined ? preferred_doctor : customer.preferred_doctor,
            preferred_day: preferred_day !== undefined ? preferred_day : customer.preferred_day,
            preferred_time: preferred_time !== undefined ? preferred_time : customer.preferred_time,
            preferred_contact: preferred_contact || customer.preferred_contact,
            reminder_type: reminder || customer.reminder_type,
            language: language || customer.language,
            notes: notes || customer.notes,
            status: status || customer.status
        });

        return res.success(customer, 'Customer updated successfully', 200)

    } catch (error) {
        console.error('Error updating customer:', error);
        res.fail('Failed to update customer', 500)
    }
});
// ============================================
// GET /api/customers/get-all-by-query
// Search customers by name, email, or phone
// ============================================
router.get('/get-all-by-query', async (req, res) => {
    try {
        const { query } = req.query;

        // ✅ Validate query parameter
        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // ✅ Build search conditions
        const searchTerm = query.trim();
        const where = {
            [Op.or]: [
                { name: { [Op.like]: `%${searchTerm}%` } },
                { email: { [Op.like]: `%${searchTerm}%` } },
                { phone: { [Op.like]: `%${searchTerm}%` } }
            ]
        };



        // ✅ Execute query with pagination
        const { count, rows } = await Customer.findAndCountAll({
            where,
            attributes: {
                exclude: ['password'] // Exclude sensitive data
            },
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ],
            limit: 10
        });

        // ✅ Return results
        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('Error fetching customers by query:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ✅ Get all customers
router.get('/all', authenticate, async (req, res) => {
    try {
        const {
            search,
            status,
            preferred_contact,
            sortBy,
            sortOrder,
            page,
            limit
        } = req.query;

        // Build where clause
        const where = {};
        if (status) {
            where.status = status;
        }
        if (preferred_contact) {
            where.preferred_contact = preferred_contact;
        }

        // Search functionality
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Sorting
        const order = [];
        if (sortBy) {
            const sortDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';
            order.push([sortBy, sortDirection]);
        } else {
            order.push(['created_at', 'DESC']);
        }

        const { count, rows } = await Customer.findAndCountAll({
            where,
            order,
            limit: limitNum,
            offset
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum)
            }
        });

    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers'
        });
    }
});

// ✅ Get customer by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });

    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer'
        });
    }
});



// ✅ Delete customer (soft delete or hard delete)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query;

        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        if (permanent === 'true') {
            // Hard delete
            await customer.destroy();
            res.json({
                success: true,
                message: 'Customer permanently deleted'
            });
        } else {
            // Soft delete - set status to archived
            await customer.update({ status: 'archived' });
            res.json({
                success: true,
                message: 'Customer archived successfully'
            });
        }

    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete customer'
        });
    }
});

// ✅ Get customer preferences
router.get('/:id/preferences', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByPk(id, {
            attributes: [
                'id',
                'name',
                'preferred_location',
                'preferred_doctor',
                'preferred_day',
                'preferred_time',
                'preferred_contact'
            ]
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });

    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch preferences'
        });
    }
});

// ✅ Get customer by email or phone (for appointments)
router.get('/search', authenticate, async (req, res) => {
    try {
        const { email, phone } = req.query;

        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or phone to search'
            });
        }

        const where = {};
        if (email) {
            where.email = email.toLowerCase().trim();
        }
        if (phone) {
            where.phone = phone.trim();
        }

        const customer = await Customer.findOne({ where });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: customer
        });

    } catch (error) {
        console.error('Error searching customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search customer'
        });
    }
});


export default router;