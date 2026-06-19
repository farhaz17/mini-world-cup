import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import teamsRoutes from './routes/teams';
import playersRoutes from './routes/players';
import squadRoutes from './routes/squad';
import matchesRoutes from './routes/matches';
import leagueRoutes from './routes/league';
import bannersRoutes from './routes/banners';
import adminRoutes from './routes/admin';
import statsRoutes from './routes/stats';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/squad', squadRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/league', leagueRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', uptime: Math.floor(process.uptime()) });
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fantasy-league')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
