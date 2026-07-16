import cron from 'node-cron';
import { sendAppointmentReminders } from './tasks.js';

cron.schedule('1,31 * * * *', () => {
    sendAppointmentReminders();
});