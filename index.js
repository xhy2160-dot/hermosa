import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { responseHandler } from './middleware/responseHandler.js';
import { authenticate } from './middleware/auth.js';
import './cron/cron.js';

// Route Imports
import authRoutes from './routes/auth.js';
import staffRoutes from './routes/staff.js';
import customersRoutes from './routes/customers.js';
import treatmentRoutes from './routes/treatment.js';
import roomRoutes from './routes/rooms.js';
import appointmentRoutes from './routes/appointment.js';
import paymentRoutes from './routes/payments.js';
import storeCreditRoutes from './routes/storeCredits.js';
import logRoutes from './routes/logs.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable ETag header
app.disable('etag');

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'https://xoxy.cc',
    'https://www.xoxy.cc',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Body Parsing Middleware (Keep 50mb limits, removed redundant call)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Static Files & Response Formatter
app.use(express.static(path.join(__dirname, 'public')));
app.use(responseHandler);

// Public Routes (Unauthenticated)
app.use('/api/auth', authRoutes);

// Protected API Routes
app.use('/api/staff', authenticate, staffRoutes);
app.use('/api/customers', authenticate, customersRoutes);
app.use('/api/treatment', authenticate, treatmentRoutes);
app.use('/api/rooms', authenticate, roomRoutes);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/payments', authenticate, paymentRoutes);
app.use('/api/store-credits', authenticate, storeCreditRoutes);
app.use('/api/logs', authenticate, logRoutes);


app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running cleanly on port ${PORT}`));