import Surge from '@surgeapi/node';
import { Op } from 'sequelize';
import sequelize from '../db.js';
import db from '../models/index.js';
import { getReminderMessage } from '../utils/translations.js';
const { Customer, Treatment, Appointment } = db;

const client = new Surge({
    apiKey: process.env['SURGE_API_KEY'],
});

const toLocalSQLString = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const sendAppointmentReminders = async () => {
    console.log('Local Time:', new Date().toString());
    console.log('⏰ Starting appointment reminder check...');

    const now = new Date();
    const maxWindow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const startString = toLocalSQLString(now);
    const endString = toLocalSQLString(maxWindow);

    try {
        const appointments = await Appointment.findAll({
            where: {
                status: 'scheduled',
                [Op.and]: [
                    sequelize.literal(`CONCAT(date, ' ', start_time) >= :startWindow`),
                    sequelize.literal(`CONCAT(date, ' ', start_time) <= :endWindow`)
                ]
            },
            replacements: { startWindow: startString, endWindow: endString },
            include: [
                {
                    model: Treatment,
                    as: 'treatment',
                    required: true,
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            required: true,
                        }
                    ]
                }
            ]
        });

        if (appointments.length === 0) {
            console.log('✅ No upcoming scheduled appointments in the queue.');
            return;
        }

        console.log(`Processing ${appointments.length} appointments sequentially...`);

        for (const appointment of appointments) {
            const { start_time, id, treatment, date, reminder_24h_sent, reminder_1h_sent } = appointment;
            const customer = treatment?.customer;

            if (!customer || !customer.phone) continue;

            const reminderType = customer.reminder_type;
            if (!reminderType || reminderType === 'none') continue;

            const appointmentTime = new Date(`${date} ${start_time}`);
            const timeDiffMs = appointmentTime - now;
            const diffInHours = timeDiffMs / (1000 * 60 * 60);
            const diffInMinutes = timeDiffMs / (1000 * 60);

            const spaPhone = process.env.MED_SPA_PHONE || '+1 (226) 503-8015';
            const spaEmail = process.env.MED_SPA_EMAIL || 'info@hermosamedspa.com';

            // =================================================================
            // TRIGGER 1: Independent 24-Hour Reminder
            // =================================================================
            const wants24h = reminderType === '24h' || reminderType === 'both';
            if (wants24h && !reminder_24h_sent && diffInHours > 0 && diffInHours <= 24.5) {
                try {
                    const messageBody24h = getReminderMessage(
                        customer.language,
                        customer.name,
                        '24-hour',
                        date,
                        start_time,
                        spaPhone,
                        spaEmail
                    );

                    await client.messages.create('acct_01kxgbx3aae0pt946967rn9hkf', {
                        body: messageBody24h,
                        conversation: { contact: { phone_number: customer.phone } }
                    });

                    appointment.reminder_24h_sent = new Date();
                    await appointment.save();
                    console.log(`✉️ Successful 24-hour SMS (${customer.language}) sent to ${customer.name}`);
                } catch (smsError) {
                    console.error(`❌ Failed to send 24-hour SMS to ${customer.name}:`, smsError.message);
                }
            }

            // =================================================================
            // TRIGGER 2: Independent 1-Hour Reminder
            // =================================================================
            const wants1h = reminderType === '1h' || reminderType === 'both';
            if (wants1h && !reminder_1h_sent && diffInMinutes > 0 && diffInMinutes <= 75) {
                try {
                    const messageBody1h = getReminderMessage(
                        customer.language,
                        customer.name,
                        '1-hour',
                        date,
                        start_time,
                        spaPhone,
                        spaEmail
                    );

                    await client.messages.create('acct_01kxgbx3aae0pt946967rn9hkf', {
                        body: messageBody1h,
                        conversation: { contact: { phone_number: customer.phone } }
                    });

                    appointment.reminder_1h_sent = new Date();
                    await appointment.save();
                    console.log(`✉️ Successful 1-hour SMS (${customer.language}) sent to ${customer.name}`);
                } catch (smsError) {
                    console.error(`❌ Failed to send 1-hour SMS to ${customer.name}:`, smsError.message);
                }
            }
        }

        console.log('🎉 Reminder processing batch finished.');

    } catch (dbError) {
        console.error('❌ Database query or reminder process failed:', dbError);
    }
};