import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchEvent {
  type: 'goal' | 'assist' | 'yellow' | 'red' | 'cleansheet';
  playerId: mongoose.Types.ObjectId;
  minute: number;
}

export interface IMatch extends Document {
  gameweek: number;
  homeTeam: mongoose.Types.ObjectId;
  awayTeam: mongoose.Types.ObjectId;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'live' | 'completed';
  matchTime: Date;
  minute: number | null;
  events: IMatchEvent[];
}

const matchSchema = new Schema<IMatch>({
  gameweek: { type: Number, required: true },
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  status: { type: String, enum: ['scheduled', 'live', 'completed'], default: 'scheduled' },
  matchTime: { type: Date, required: true },
  minute: { type: Number, default: null },
  events: [
    {
      type: { type: String, enum: ['goal', 'assist', 'yellow', 'red', 'cleansheet'] },
      playerId: { type: Schema.Types.ObjectId, ref: 'Player' },
      minute: { type: Number },
    },
  ],
});

export default mongoose.model<IMatch>('Match', matchSchema);
