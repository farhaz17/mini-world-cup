import mongoose, { Document, Schema } from 'mongoose';

export interface IGameweek extends Document {
  number: number;
  deadline: Date;
  status: 'upcoming' | 'active' | 'completed';
  isCurrent: boolean;
}

const gameweekSchema = new Schema<IGameweek>({
  number: { type: Number, required: true, unique: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  isCurrent: { type: Boolean, default: false },
});

export default mongoose.model<IGameweek>('Gameweek', gameweekSchema);
