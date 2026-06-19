import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  teamId: mongoose.Types.ObjectId;
  position: 'GK' | 'DEF' | 'FWD';
  price: number;
  totalPoints: number;
  gameweekPoints: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  form: number;
  selectedBy: number;
  isAvailable: boolean;
  overallRating: number;
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number;
}

const playerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  position: { type: String, enum: ['GK', 'DEF', 'FWD'], required: true },
  price: { type: Number, required: true },
  totalPoints: { type: Number, default: 0 },
  gameweekPoints: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  cleanSheets: { type: Number, default: 0 },
  form: { type: Number, default: 0 },
  selectedBy: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  overallRating: { type: Number, default: 70 },
  pace: { type: Number, default: 70 },
  shooting: { type: Number, default: 70 },
  passing: { type: Number, default: 70 },
  defending: { type: Number, default: 70 },
  physical: { type: Number, default: 70 },
});

export default mongoose.model<IPlayer>('Player', playerSchema);
