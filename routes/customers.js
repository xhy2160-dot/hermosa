// routes/customers.js
import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
const { sequelize, Customer, CustomerRecord } = db;
import { authenticate } from '../middleware/auth.js';
import { formatNAPhoneNumber } from '../utils/formatPhoneNo.js';



const router = express.Router();

const DEFAULT_WORKBOOK_DATA = `{"id":"workbook-01","sheetOrder":["sheet-01","sheet-02","sheet-03"],"name":"universheet","appVersion":"3.0.0-alpha","locale":"enUS","styles":{},"sheets":{"sheet-01":{"type":0,"id":"sheet-01","cellData":{"0":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"1":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"2":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"3":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"4":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"5":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"6":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"7":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"8":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"9":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"10":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"11":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"12":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"13":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}},"14":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{}}},"name":"sheet1","tabColor":"red","hidden":0,"rowCount":1000,"columnCount":20,"zoomRatio":1,"scrollTop":200,"scrollLeft":100,"defaultColumnWidth":93,"defaultRowHeight":27,"status":1,"showGridlines":1,"hideRow":[],"hideColumn":[],"rowHeader":{"width":46,"hidden":0},"columnHeader":{"height":20,"hidden":0},"selections":["A2"],"rightToLeft":0,"pluginMeta":{},"freeze":{"xSplit":0,"ySplit":0,"startRow":-1,"startColumn":-1},"mergeData":[],"rowData":{"2":{"hd":0,"h":27,"ah":27},"3":{"hd":0,"h":27,"ah":27},"4":{"hd":0,"h":27,"ah":27},"6":{"hd":0,"h":27,"ah":27},"8":{"hd":0,"h":27,"ah":27},"10":{"hd":0,"h":27,"ah":27}},"columnData":{}},"sheet-02":{"type":0,"id":"sheet-02","name":"sheet2","cellData":{},"tabColor":"","hidden":0,"rowCount":1000,"columnCount":20,"zoomRatio":1,"freeze":{"xSplit":0,"ySplit":0,"startRow":-1,"startColumn":-1},"scrollTop":0,"scrollLeft":0,"defaultColumnWidth":88,"defaultRowHeight":24,"mergeData":[],"rowData":{},"columnData":{},"showGridlines":1,"rowHeader":{"width":46,"hidden":0},"columnHeader":{"height":20,"hidden":0},"rightToLeft":0},"sheet-03":{"type":0,"id":"sheet-03","name":"sheet3","cellData":{},"tabColor":"","hidden":0,"rowCount":1000,"columnCount":20,"zoomRatio":1,"freeze":{"xSplit":0,"ySplit":0,"startRow":-1,"startColumn":-1},"scrollTop":0,"scrollLeft":0,"defaultColumnWidth":88,"defaultRowHeight":24,"mergeData":[],"rowData":{},"columnData":{},"showGridlines":1,"rowHeader":{"width":46,"hidden":0},"columnHeader":{"height":20,"hidden":0},"rightToLeft":0}},"resources":[]}`

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

        // 1. Validate required fields
        if (!name || !phone) {
            return res.fail('Missing required fields: name and phone are required', 400);
        }

        const normalizedPhone = formatNAPhoneNumber(phone);
        if (normalizedPhone === null) {
            return res.fail('Invalid phone number format', 400);
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : null;

        // 2. Build duplicate search criteria
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
                const isEmailDup = normalizedEmail && existingCustomer.email === normalizedEmail;
                const isPhoneDup = normalizedPhone && existingCustomer.phone === normalizedPhone;

                let message = 'Customer already exists';
                if (isEmailDup && isPhoneDup) message = 'Customer with this email and phone number already exists';
                else if (isEmailDup) message = 'Customer with this email already exists';
                else if (isPhoneDup) message = 'Customer with this phone number already exists';

                return res.fail(message, 409);
            }
        }

        // 3. Execute creation within a Managed Sequelize Transaction
        const result = await sequelize.transaction(async (t) => {
            // Step A: Create Customer
            const customer = await Customer.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
                preferred_location: preferred_location || null,
                preferred_doctor: preferred_doctor || null,
                preferred_day: preferred_day || null,
                preferred_time: preferred_time || null,
                preferred_contact: preferred_contact || 'email',
                reminder_type: reminder || '24 hour',
                language: language || 'EN',
                notes: notes || null,
                status: 'active'
            }, { transaction: t });

            // Step B: Create default CustomerRecord with stringified initial workbook
            const workbookPayload = typeof DEFAULT_WORKBOOK_DATA === 'string'
                ? DEFAULT_WORKBOOK_DATA
                : JSON.stringify(DEFAULT_WORKBOOK_DATA);

            const record = await CustomerRecord.create({
                customerId: customer.id,
                workbook: workbookPayload
            }, { transaction: t });

            return { customer, record };
        });

        return res.success(result.customer, 'Customer created successfully', 201);

    } catch (error) {
        console.error('Error creating customer:', error);
        return res.fail('Internal server error', 500);
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
router.get('/', authenticate, async (req, res) => {
    try {
        const { id } = req.query;
        const result = await Customer.findByPk(id, {
            include: [{ model: CustomerRecord, as: 'record' }]
        });

        if (!result) {
            return res.fail('Customer not found', 404)
        }
        return res.success(result, 'Customer fetched successfully', 200)

    } catch (error) {
        console.error('Error fetching customer:', error);
        res.fail('Failed to fetch customer', 500)
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



//--------------------------------new page
// router.post('/upload-excel', upload.single('file'), async (req, res) => {
//     try {
//         const workbook = xlsx.readFile(req.file.path);
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const raw = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

//         // Find header row (skip duplicate headers)
//         let dataStart = 0;
//         for (let i = 0; i < Math.min(15, raw.length); i++) {
//             const cell = String(raw[i][0] || '').trim().toLowerCase();
//             if (cell === 'date') {
//                 dataStart = i + 1;
//                 break;
//             }
//         }

//         // Parse rows
//         const records = [];
//         for (let i = dataStart; i < raw.length; i++) {
//             const row = raw[i];
//             if (!row || row.every(c => !c || String(c).trim() === '')) continue;

//             records.push({
//                 date: String(row[0] || '').trim(),
//                 treatment: String(row[1] || '').trim(),
//                 locationStaff: String(row[2] || '').trim(),
//                 payment: String(row[3] || '').trim(),
//                 amount: row[4] !== '' ? parseFloat(row[4]) : null,
//                 total: row[5] !== '' ? parseFloat(row[5]) : null,
//                 balance: row[6] !== '' ? parseFloat(row[6]) : null,
//                 remark: String(row[7] || '').trim(),
//                 rowIndex: i
//             });
//         }

//         // Parse "Vanessa Wang 6479875030" from filename
//         const base = req.file.originalname.replace(/\.(xlsx|xls)$/i, '').trim();
//         const parts = base.split(/\s+/);
//         const last = parts[parts.length - 1];
//         const isPhone = /^[\d\s\-\+]+$/.test(last) && last.replace(/\D/g, '').length >= 7;

//         const name = req.body.name || (isPhone ? parts.slice(0, -1).join(' ') : base);
//         const phone = req.body.phone || (isPhone ? last.replace(/\D/g, '') : '');

//         if (!phone) {
//             return res.status(400).json({ error: 'Could not detect phone from filename. Provide phone manually.' });
//         }

//         const [customer, created] = await Customer.findOrCreate({
//             where: { phone },
//             defaults: { name, email: req.body.email || null, sourceFile: req.file.originalname }
//         });

//         // If customer exists, we append records (or you could destroy old ones first)
//         await CustomerRecord.bulkCreate(
//             records.map(r => ({ ...r, customerId: customer.id }))
//         );

//         const result = await Customer.findByPk(customer.id, {
//             include: [{ model: CustomerRecord, as: 'records' }]
//         });

//         res.json(result);
//     } catch (err) {
//         console.error('Error processing Excel upload:', err);
//         res.status(500).json({ error: err.message });
//     }
// });
router.post('/upload-excel', async (req, res) => {
    try {
        console.log('Upload payload body:', req.body);
        const { name, email, workbookData } = req.body;
        let { phone } = req.body
        // 1. Validation
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required to identify customer' });
        }

        phone = formatNAPhoneNumber(phone)

        const payloadWorkbook = workbookData || workbook;
        if (!payloadWorkbook) {
            return res.status(400).json({ error: 'Workbook data payload is missing' });
        }

        // Convert object to string if model setters aren't configured
        const stringifiedWorkbook = typeof payloadWorkbook === 'object'
            ? JSON.stringify(payloadWorkbook)
            : payloadWorkbook;

        // 2. Find or create Customer by phone number
        const [customer, createdCustomer] = await Customer.findOrCreate({
            where: { phone },
            defaults: { name, email }
        });

        // If customer already existed, optionally update their details
        if (!createdCustomer && (name || email)) {
            await customer.update({
                ...(name && { name }),
                ...(email && { email })
            });
        }

        // 3. Upsert Customer Record (Create or Update existing workbook)
        const [record, createdRecord] = await CustomerRecord.findOrCreate({
            where: { customerId: customer.id },
            defaults: {
                customerId: customer.id,
                workbook: stringifiedWorkbook
            }
        });

        // If record already existed, update its workbook column
        if (!createdRecord) {
            await record.update({
                workbook: stringifiedWorkbook
            });
        }

        // 4. Return customer with updated records included
        const result = await Customer.findByPk(customer.id, {
            include: [
                { model: CustomerRecord, as: 'record' }
            ]
        });

        return res.status(200).json({
            message: createdRecord ? 'Excel data uploaded & record created' : 'Excel data updated successfully',
            data: result
        });

    } catch (err) {
        console.error('Error processing Excel upload:', err);
        return res.status(500).json({ error: err.message });
    }
});
router.post('/save-cell-edit', authenticate, async (req, res) => {
    try {
        const { customer_id, workbookData } = req.body;
        // Validate required fields
        if (!customer_id || !workbookData) {
            return res.fail('Missing customerId or workbookData', 400);
        }

        // Convert workbook JSON object to string if model getter/setter isn't doing it automatically
        const workbookPayload = typeof workbookData === 'object'
            ? JSON.stringify(workbookData)
            : workbookData;

        // Upsert pattern: Find record by customerId or create a new one
        const [record, created] = await CustomerRecord.findOrCreate({
            where: { customerId: customer_id },
            defaults: {
                customerId: customer_id,
                workbook: workbookPayload
            }
        });

        // If record already existed, update its workbook column payload
        if (!created) {
            await record.update({
                workbook: workbookPayload
            });
        }

        return res.success(
            { saved: true, recordId: record.id, customerId: customer_id },
            created ? 'Workbook record created successfully' : 'Workbook updated successfully',
            200
        );

    } catch (err) {
        console.error('Error saving workbook payload:', err);
        return res.fail('Failed to save workbook changes', 500);
    }
});

router.get('/get-records-by-customerId', async (req, res) => {
    try {
        const customerId = req.query.customerId || req.query.customer_id;

        if (!customerId) {
            return res.status(400).json({ error: 'Missing customerId query parameter' });
        }

        const record = await CustomerRecord.findOne({
            where: { customerId }
        });

        return res.status(200).json({
            success: true,
            data: record
        });

    } catch (err) {
        console.error('Error fetching record by customerId:', err);
        return res.status(500).json({ error: err.message || 'Failed to fetch record' });
    }
});
export default router;