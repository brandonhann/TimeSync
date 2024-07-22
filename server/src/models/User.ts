import mongoose, { Document, Model, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    name: string;
    githubId?: string;
    isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    githubId: { type: String },
});

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: unknown) {
        next(err as CallbackError);
    }
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User, IUser };