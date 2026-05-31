// Entry
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './auth';
import workoutRoutes from './workouts';
import exerciseRoutes from './exercises';

// load env variables
dotenv.config();

const app = express();

// security headers
app.use(helmet());

// restrict CORS to frontend only
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// rate limiting on auth routes (max 20 requests per 15 min)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later' }
});
app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

// swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Workout Tracker API',
            version: '1.0.0',
            description: 'REST API for tracking workouts'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// keep render alive ping
setInterval(() => {
    fetch('https://workout-api-q9v4.onrender.com/api-docs')
        .catch(() => {})
}, 10 * 60 * 1000)

// mongo connect
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log('DB error:', err);
    });