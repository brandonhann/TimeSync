import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ success: false, message: 'User already exists' });
        }
        const newUser = new User({ email, password, name });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).send({ success: false, message: 'Login after registration failed' });
            }

            res.status(201).send({ success: true, message: 'User registered and logged in', userId: newUser._id });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: 'An unexpected error occurred' });
    }
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: IUser, info: any) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Authentication failed' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        req.login(user, (loginErr: any) => {
            if (loginErr) {
                return res.status(500).json({ success: false, message: 'Login failed' });
            }
            return res.status(200).json({ success: true, message: 'Logged in successfully', userId: user._id });
        });
    })(req, res, next);
});

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
    (req: Request, res: Response) => {
        const user = req.user as IUser;
        res.redirect(`http://localhost:3000?userId=${user._id}`);
    });

export { router as authRoutes };