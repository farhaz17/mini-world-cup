import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  shortName: string;
  flag: string;
  primaryColor: string;
  darkColor: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  flag: { type: String, required: true },
  primaryColor: { type: String, required: true },
  darkColor: { type: String, required: true },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

export default mongoose.model<ITeam>('Team', teamSchema);
