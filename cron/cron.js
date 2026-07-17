import cron from 'node-cron';
import { sendAppointmentReminders } from './tasks.js';

cron.schedule('* * * * *', async () => {
    await sendAppointmentReminders();
});

// cron.schedule('1,31 * * * *', async () => {
//     await sendAppointmentReminders();
// });