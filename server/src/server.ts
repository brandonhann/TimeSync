import express from 'express';
import session from 'express-session';
import passport from './passport';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import bodyParser from 'body-parser';
import { authRoutes } from './routes/authRoutes';

dotenv.config();
connectDB();

const app = express();

if (!process.env.SESSION_SECRET) {
    console.error('FATAL ERROR: SESSION_SECRET is not defined.');
    process.exit(1);
}

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(bodyParser.json());
app.use('/api', authRoutes);

app.listen(3001, () => console.log('Server running on http://localhost:3001'));