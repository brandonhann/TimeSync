import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId).select('-password -githubId');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An unexpected error occurred', error });
    }
});

export { router as settingsRoutes };