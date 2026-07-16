import Surge from '@surgeapi/node';
import { Op } from 'sequelize';
import sequelize from '../db.js';
import db from '../models/index.js';
const { Customer, Treatment, Appointment } = db;

const client = new Surge({
    apiKey: process.env['SURGE_API_KEY'], // This is the default and can be omitted
});

export const sendAppointmentReminders = async () => {
    console.log('⏰ Starting appointment reminder check...');

    // Define our 24-hour window starting from right now
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const startWindow = now.toISOString().slice(0, 19).replace('T', ' ');
    const endWindow = twentyFourHoursFromNow.toISOString().slice(0, 19).replace('T', ' ');

    try {
        // 1. Query appointments using nested eager loading: Appointment -> Treatment -> Customer
        const appointments = await Appointment.findAll({
            where: {
                reminder_sent: null,
                status: 'scheduled',

                // 2. Combine date + start_time and evaluate if it falls inside our window
                [Op.and]: [
                    sequelize.literal(`CONCAT(date, ' ', start_time) >= '${startWindow}'`),
                    sequelize.literal(`CONCAT(date, ' ', start_time) <= '${endWindow}'`)
                ]
            },
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

        console.log(appointments)

        if (appointments.length === 0) {
            console.log('✅ No pending 24-hour reminders found.');
            return;
        }

        console.log(`✉️ Found ${appointments.length} appointments to remind.`);

        // 2. Map and process SMS tasks asynchronously
        const smsPromises = appointments.map(async (appointment) => {
            const { start_time, id, treatment, date } = appointment;
            const customer = treatment?.customer;

            // Guard against missing customer or phone data
            if (!customer || !customer.phone) {
                console.warn(`⚠️ Skipping Appt ID ${id}: Missing customer details or phone number.`);
                return;
            }

            // Format the appointment time nicely (e.g., "02:30 PM")
            const formattedTime = new Date(start_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            const messageBody = `Hi ${customer.name}, this is a reminder for your appointment at Hermosa Medspa on ${date} at ${start_time}. Reply STOP to opt out.`;
            // const messageBody = `hello 提醒下明天 12:30 north york location 的 picoway 預約。`;
            try {
                // Send the SMS via Surge using dynamic values
                const smsResponse = await client.messages.create('acct_01kxgbx3aae0pt946967rn9hkf', {
                    body: messageBody, // Sends the dynamic reminder text
                    conversation: {
                        contact: {
                            phone_number: '+12265038015' // Dynamic E.164 phone number
                        }
                    }
                });

                // 3. Mark as sent in the database so we never remind them twice
                appointment.reminder_sent = new Date();
                await appointment.save();

                console.log(smsResponse);

            } catch (smsError) {
                console.error(`❌ Failed to send SMS to ${customer.name}-${customer.phone} (Appt ID: ${id}):`, smsError.message);
            }
        });

        // Wait for all messages in this batch to resolve (or fail)
        await Promise.allSettled(smsPromises);
        console.log('🎉 Reminder task finished.');

    } catch (dbError) {
        console.error('❌ Database query or reminder process failed:', dbError);
    }
};


