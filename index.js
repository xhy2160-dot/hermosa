import dotenv from 'dotenv'
dotenv.config()


// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';                // 👈 ADD THIS LINE
import { fileURLToPath } from 'url';

// Import your dedicated router
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import staffRoutes from './routes/staff.js';
import customersRoutes from './routes/customers.js';
import treatmentRoutes from './routes/treatment.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(authenticate);
// Mount your routes under a specific base path
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/treatment', treatmentRoutes);


app.listen(3000, () => console.log('Server running cleanly on port 3000'));