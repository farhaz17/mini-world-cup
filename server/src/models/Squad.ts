import mongoose, { Document, Schema } from 'mongoose';

export interface ISquad extends Document {
  userId: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
  budget: number;
  totalPoints: number;
  gameweekPoints: number;
  gameweek: number;
  transfersRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const squadSchema = new Schema<ISquad>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    budget: { type: Number, default: 50 },
    totalPoints: { type: Number, default: 0 },
    gameweekPoints: { type: Number, default: 0 },
    gameweek: { type: Number, default: 1 },
    transfersRemaining: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export default mongoose.model<ISquad>('Squad', squadSchema);
