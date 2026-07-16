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
    // We grab appointments up to 25 hours out to cover the 24h window comfortably
    const maxWindow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const startString = toLocalSQLString(now)
    console.log('Database Start Window Variable:', startString);
    const endString = toLocalSQLString(maxWindow)

    try {
        // 1. Grab scheduled appointments in our target timeframe
        const appointments = await Appointment.findAll({
            where: {
                status: 'scheduled',
                [Op.and]: [
                    sequelize.literal(`CONCAT(date, ' ', start_time) >= :startWindow`),
                    sequelize.literal(`CONCAT(date, ' ', start_time) <= :endWindow`)
                ]
            },
            // Secure bind parameters to prevent SQL injection vulnerabilities
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

        const smsPromises = appointments.map(async (appointment) => {
            const { start_time, id, treatment, date, reminder_24h_sent, reminder_1h_sent } = appointment;
            const customer = treatment?.customer;

            // Guard against missing customer, phone, or opt-out settings
            if (!customer || !customer.phone) {
                console.warn(`⚠️ Skipping Appt ID ${id}: Missing customer details or phone number.`);
                return;
            }

            const reminderType = customer.reminder_type;
            if (!reminderType || reminderType === 'none') {
                return; // Customer does not want reminders
            }

            // Calculate precise timing
            const appointmentTime = new Date(`${date}T${start_time}`);
            const timeDiffMs = appointmentTime - now;
            const diffInHours = timeDiffMs / (1000 * 60 * 60);
            const diffInMinutes = timeDiffMs / (1000 * 60);

            // Determine which reminder needs sending
            let is24hTrigger = false;
            let is1hTrigger = false;

            // --- Evaluation 1: Should we send the 24-hour reminder? ---
            const wants24h = reminderType === '24 hour' || reminderType === 'both';
            if (wants24h && !reminder_24h_sent && diffInHours > 0 && diffInHours <= 24.5) {
                is24hTrigger = true;
            }

            // --- Evaluation 2: Should we send the 1-hour reminder? ---
            const wants1h = reminderType === '1 hour' || reminderType === 'both';
            // Trigger 1 hour prior if the 24h reminder isn't hogging this window
            if (wants1h && !reminder_1h_sent && diffInMinutes > 0 && diffInMinutes <= 75) {
                is1hTrigger = true;
            }

            // Skip if no active triggers apply to this run
            if (!is24hTrigger && !is1hTrigger) {
                return;
            }

            const activeTriggerType = is24hTrigger ? '24-hour' : '1-hour';

            // Resolve contact info safely with fallbacks
            const spaPhone = process.env.MED_SPA_PHONE || '+1 (226) 503-8015';
            const spaEmail = process.env.MED_SPA_EMAIL || 'info@hermosamedspa.com';

            // 💡 Dynamically resolve the multilingual translation based on customer preference
            const messageBody = getReminderMessage(
                customer.language, // e.g. 'en', 'zh-cn', 'zh-tw', 'ko'
                customer.name,
                activeTriggerType,
                date,
                start_time,
                spaPhone,
                spaEmail
            );

            try {
                // Send the SMS dynamically using customer's real phone number
                const smsResponse = await client.messages.create('acct_01kxgbx3aae0pt946967rn9hkf', {
                    body: messageBody,
                    conversation: {
                        contact: {
                            phone_number: customer.phone
                        }
                    }
                });

                // Update the specific tracking timestamp in database
                if (is24hTrigger) {
                    appointment.reminder_24h_sent = new Date();
                } else if (is1hTrigger) {
                    appointment.reminder_1h_sent = new Date();
                }

                await appointment.save();
                console.log(`✉️ Successful ${activeTriggerType} SMS (${customer.language}) sent to ${customer.name} (${customer.phone})`);

            } catch (smsError) {
                console.error(`❌ Failed to send ${activeTriggerType} SMS to ${customer.name} (Appt ID: ${id}):`, smsError.message);
            }
        });

        // Resolve all tasks concurrently 
        await Promise.allSettled(smsPromises);
        console.log('🎉 Reminder processing batch finished.');

    } catch (dbError) {
        console.error('❌ Database query or reminder process failed:', dbError);
    }
};