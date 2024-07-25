import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { SavedCities } from '../models/SavedCities';

const router = express.Router();

router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId).select('-password -githubId');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const savedCities = await SavedCities.findOne({ user: user._id });

        res.json({ success: true, user, homeCity: savedCities?.homeCity || null });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An unexpected error occurred', error });
    }
});

router.put('/user/:userId/homeCity', async (req: Request, res: Response) => {
    try {
        const { homeCity } = req.body;
        const userId = req.params.userId;

        let savedCities = await SavedCities.findOne({ user: userId });
        if (!savedCities) {
            savedCities = new SavedCities({ user: userId, homeCity, savedCities: [] });
        } else {
            savedCities.homeCity = homeCity;
        }

        await savedCities.save();

        res.json({ success: true, message: 'Home city updated successfully', homeCity });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An unexpected error occurred', error });
    }
});

router.delete('/user/:userId/homeCity', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        let savedCities = await SavedCities.findOne({ user: userId });
        if (savedCities) {
            savedCities.homeCity = null;
            await savedCities.save();
            res.json({ success: true, message: 'Home city removed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Saved cities not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An unexpected error occurred', error });
    }
});

export { router as settingsRoutes };