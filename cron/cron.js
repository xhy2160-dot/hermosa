import cron from 'node-cron';
import { sendAppointmentReminders } from './tasks.js';

cron.schedule('*/10 * * * *', async () => {
    await sendAppointmentReminders();
});

// cron.schedule('1,31 * * * *', async () => {
//     await sendAppointmentReminders();
// });