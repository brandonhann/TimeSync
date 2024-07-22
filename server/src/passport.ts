import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from './models/User';
import bcrypt from 'bcryptjs';

require('dotenv').config();

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set');
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email: string, password: string, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid password.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:3001/api/auth/github/callback"
}, async (accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: IUser | false) => void) => {
    const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
    const name = profile.displayName || profile.username;

    try {
        let user = await User.findOne({ $or: [{ githubId: profile.id }, { email }] });
        if (!user) {
            user = new User({
                githubId: profile.id,
                name,
                email,
                password: 'defaultpassword'
            });
            await user.save();
        } else {
            if (!user.githubId) {
                user.githubId = profile.id;
                await user.save();
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;