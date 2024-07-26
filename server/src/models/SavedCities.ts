import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { IUser } from './User';

interface ISavedCities extends Document {
    user: IUser['_id'];
    homeCity: string | null;
    savedCities: string[];
}

const savedCitiesSchema = new Schema<ISavedCities>({
    user: { type: Types.ObjectId as any, ref: 'User', required: true, unique: true },
    homeCity: { type: String, required: false },
    savedCities: [{ type: String }]
});

const SavedCities: Model<ISavedCities> = mongoose.model<ISavedCities>('SavedCities', savedCitiesSchema);

export { SavedCities, ISavedCities };