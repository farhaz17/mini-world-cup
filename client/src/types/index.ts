export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  teamName: string;
  createdAt: string;
}

export interface Team {
  _id: string;
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

export interface Player {
  _id: string;
  name: string;
  teamId: Team;
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

export interface PlayerStats {
  topScorer: Player | null;
  topAssists: Player | null;
  mvp: Player | null;
  topCleanSheet: Player | null;
  overview: {
    totalGoals: number;
    totalAssists: number;
    totalCleanSheets: number;
    totalPoints: number;
  };
}

export interface Squad {
  _id: string;
  userId: string;
  players: Player[];
  budget: number;
  totalPoints: number;
  gameweekPoints: number;
  gameweek: number;
  transfersRemaining: number;
}

export interface Match {
  _id: string;
  gameweek: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'live' | 'completed';
  matchTime: string;
  minute: number | null;
}

export interface LeagueEntry {
  _id: string;
  userId: { _id: string; name: string; teamName: string };
  totalPoints: number;
  gameweekPoints: number;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  tagline: string;
  backgroundGradient: string;
  accentColor: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
