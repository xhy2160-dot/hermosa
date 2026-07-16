import express from 'express';
import db from '../models/index.js';
const { InstallPayment, Treatment } = db;

const router = express.Router();


router.get('/get-all-by-treatmentId', async (req, res) => {
    try {
        const { treatmentId } = req.query;
        const parsedId = parseInt(treatmentId, 10); // 补全 10 进制参数，防范旧浏览器/环境解析漏洞

        if (!treatmentId || isNaN(parsedId)) {
            return res.fail('Missing or invalid treatmentId query parameter', 400);
        }

        // 1. ✨ 合并查询：查 Treatment 的同时，一次性把关联的 payments 也捞出来
        // 假设你在 Treatment 模型里定义了 Treatment.hasMany(InstallPayment, { as: 'payments' })
        const treatmentRecord = await Treatment.findOne({
            where: { id: parsedId },
            attributes: ['total'],
            include: [
                {
                    model: InstallPayment,
                    as: 'payments', // 对应你模型里的别名
                    // 顺便在这里做好排序，让前端展现账单时从早到晚依次排列，体验更好
                }
            ],
            order: [[{ model: InstallPayment, as: 'payments' }, 'created_at', 'ASC']]
        });

        // 2. 🛡️ 安全防御：如果找不到对应的疗程记录，优雅拦截，防止后台崩溃
        if (!treatmentRecord) {
            return res.fail('Treatment record not found', 404);
        }

        // 3. 提取数据
        const treatmentTotal = parseFloat(treatmentRecord.total || 0);
        const payments = treatmentRecord.payments || [];

        // 4. 稳健的数字计算，防范 JS 浮点数相加产生多余小数位 (如 0.1 + 0.2 = 0.30000000004)
        const totalPaid = payments.reduce((sum, item) => {
            return sum + parseFloat(item.amount || 0);
        }, 0);

        const balance = parseFloat((treatmentTotal - totalPaid).toFixed(2));

        // 5. 🎯 修复响应：结构清晰，payments 以正常的数组结构交付给前端
        res.success({
            treatment_total: treatmentTotal,
            total_paid: parseFloat(totalPaid.toFixed(2)),
            balance,
            payments // 保持标准的 Array 数组格式
        }, 'Payments retrieved successfully', 200);

    } catch (error) {
        console.error('Error fetching payments:', error);
        res.fail('Failed to fetch payments', 500);
    }
});
router.post('/add', async (req, res) => {
    try {
        const {
            treatmentId,
            amount,
            payment_method
        } = req.body;

        if (!treatmentId) {
            res.fail('Missing required fields: treatmentId is required', 400);
        }
        if ((parseFloat(amount) < 0 || isNaN(parseFloat(amount)))) {
            res.fail('Missing or invalid amount', 400);
        }
        // ✅ Create treatment
        const payment = await InstallPayment.create({
            treatment_id: treatmentId,
            amount: parseFloat(amount),
            payment_method
        });

        res.success(payment, 'Payment saved successfully', 201); // Use the success method from responseHandler

    } catch (error) {
        console.error('Error creating payment:', error);
        res.fail('Failed to save payment', 500); // Use the fail method from responseHandler
    }
});

// router.put('/update', async (req, res) => {
//     try {
//         const {
//             id,
//             date,
//             start_time,
//             end_time,
//             location,
//             remark,
//             room,
//             assigned_staff
//         } = req.body;

//         const appointment = await Appointment.findByPk(id);
//         if (!appointment) {
//             return res.fail('Appointment not found', 404);
//         }

//         await appointment.update({
//             room,
//             assigned_staff,
//             location,
//             date,
//             start_time,
//             end_time,
//             remark
//         });

//         res.success(appointment, 'Appointment updated successfully', 200);
//     } catch (error) {
//         console.error('Error updating appointment:', error);
//         res.fail('Failed to update appointment', 500);
//     }
// });

export default router;