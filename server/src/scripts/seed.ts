import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Team from '../models/Team';
import Player from '../models/Player';
import Squad from '../models/Squad';
import Match from '../models/Match';
import Gameweek from '../models/Gameweek';
import Banner from '../models/Banner';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fantasy-league';

const july4 = (hour: number, min = 0) =>
  new Date(`2025-07-04T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00.000Z`);

// Zero-stats base (tournament hasn't started)
const Z = { totalPoints: 0, gameweekPoints: 0, goals: 0, assists: 0, cleanSheets: 0, form: 0 };

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}), Team.deleteMany({}), Player.deleteMany({}),
    Squad.deleteMany({}), Match.deleteMany({}), Gameweek.deleteMany({}), Banner.deleteMany({}),
  ]);
  console.log('Cleared collections');

  // ── TEAMS ─────────────────────────────────────────────────────────────────
  const teamsData = [
    { name: 'Argentina', shortName: 'ARG', flag: '🇦🇷', primaryColor: '#74ACDF', darkColor: '#003087', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: 'Brazil',    shortName: 'BRA', flag: '🇧🇷', primaryColor: '#009C3B', darkColor: '#002776', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: 'Spain',     shortName: 'ESP', flag: '🇪🇸', primaryColor: '#C60B1E', darkColor: '#F1BF00', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: 'Germany',   shortName: 'GER', flag: '🇩🇪', primaryColor: '#222222', darkColor: '#DD0000', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { name: 'France',    shortName: 'FRA', flag: '🇫🇷', primaryColor: '#002395', darkColor: '#ED2939', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ];

  const teams = await Team.insertMany(teamsData);
  const [arg, bra, esp, ger, fra] = teams;
  console.log('Teams created');

  // ── PLAYERS ───────────────────────────────────────────────────────────────
  //
  //  Categories map to positions & prices:
  //  Icons   → FWD 9.0M  OVR~91   (elite)
  //  Cat 1   → FWD 7.5M  OVR~84
  //  GK      → GK  5.5M  OVR~72-78
  //  Cat 3   → DEF 7.0M  OVR~81   (top defender tier)
  //  Cat 4   → DEF 6.0M  OVR~76
  //  Cat 5   → FWD 6.5M  OVR~78
  //  Cat 6   → DEF 5.0M  OVR~70
  //  Cat 7   → FWD 5.5M  OVR~72
  //  Cat 8   → DEF 4.5M  OVR~65
  //
  //  Each category: [ARG, BRA, ESP, GER, FRA]
  //  Each team gets 9 players: 1 GK + 4 DEF + 4 FWD

  const playersData = [

    // ── ARGENTINA ─────────────────────────────────────────────────────────
    // Icons FWD
    { ...Z, name: 'Amjad',   teamId: arg._id, position: 'FWD', price: 9.0, selectedBy: 70, overallRating: 91, pace: 93, shooting: 95, passing: 79, defending: 28, physical: 81 },
    // Cat 1 FWD
    { ...Z, name: 'Saipu',   teamId: arg._id, position: 'FWD', price: 7.5, selectedBy: 45, overallRating: 84, pace: 87, shooting: 87, passing: 73, defending: 23, physical: 74 },
    // GK
    { ...Z, name: 'Cheppu',  teamId: arg._id, position: 'GK',  price: 5.5, selectedBy: 35, overallRating: 78, pace: 56, shooting: 48, passing: 65, defending: 82, physical: 80 },
    // Cat 3 DEF
    { ...Z, name: 'Shalu',   teamId: arg._id, position: 'DEF', price: 7.0, selectedBy: 50, overallRating: 81, pace: 76, shooting: 50, passing: 71, defending: 86, physical: 83 },
    // Cat 4 DEF
    { ...Z, name: 'Farhaz',  teamId: arg._id, position: 'DEF', price: 6.0, selectedBy: 30, overallRating: 76, pace: 71, shooting: 44, passing: 66, defending: 81, physical: 78 },
    // Cat 5 FWD
    { ...Z, name: 'Mishal',  teamId: arg._id, position: 'FWD', price: 6.5, selectedBy: 38, overallRating: 78, pace: 81, shooting: 81, passing: 67, defending: 21, physical: 68 },
    // Cat 6 DEF
    { ...Z, name: 'Habbeb',  teamId: arg._id, position: 'DEF', price: 5.0, selectedBy: 22, overallRating: 70, pace: 65, shooting: 39, passing: 60, defending: 75, physical: 72 },
    // Cat 7 FWD
    { ...Z, name: 'Afri',    teamId: arg._id, position: 'FWD', price: 5.5, selectedBy: 22, overallRating: 72, pace: 75, shooting: 74, passing: 62, defending: 19, physical: 63 },
    // Cat 8 DEF
    { ...Z, name: 'Chemmu',  teamId: arg._id, position: 'DEF', price: 4.5, selectedBy: 14, overallRating: 65, pace: 60, shooting: 35, passing: 55, defending: 70, physical: 67 },

    // ── BRAZIL ────────────────────────────────────────────────────────────
    // Icons FWD
    { ...Z, name: 'Shanu',   teamId: bra._id, position: 'FWD', price: 9.0, selectedBy: 65, overallRating: 90, pace: 93, shooting: 93, passing: 78, defending: 27, physical: 80 },
    // Cat 1 FWD
    { ...Z, name: 'Aashir',  teamId: bra._id, position: 'FWD', price: 7.5, selectedBy: 42, overallRating: 83, pace: 86, shooting: 86, passing: 72, defending: 22, physical: 73 },
    // GK
    { ...Z, name: 'Ilyas',   teamId: bra._id, position: 'GK',  price: 5.5, selectedBy: 28, overallRating: 76, pace: 55, shooting: 46, passing: 63, defending: 80, physical: 78 },
    // Cat 3 DEF
    { ...Z, name: 'Rishan',  teamId: bra._id, position: 'DEF', price: 7.0, selectedBy: 46, overallRating: 80, pace: 75, shooting: 49, passing: 70, defending: 85, physical: 82 },
    // Cat 4 DEF
    { ...Z, name: 'Jallu',   teamId: bra._id, position: 'DEF', price: 6.0, selectedBy: 28, overallRating: 75, pace: 70, shooting: 43, passing: 65, defending: 80, physical: 77 },
    // Cat 5 FWD
    { ...Z, name: 'Sapru',   teamId: bra._id, position: 'FWD', price: 6.5, selectedBy: 35, overallRating: 78, pace: 81, shooting: 80, passing: 67, defending: 21, physical: 68 },
    // Cat 6 DEF
    { ...Z, name: 'Nooru',   teamId: bra._id, position: 'DEF', price: 5.0, selectedBy: 20, overallRating: 69, pace: 64, shooting: 38, passing: 59, defending: 74, physical: 71 },
    // Cat 7 FWD
    { ...Z, name: 'Shani',   teamId: bra._id, position: 'FWD', price: 5.5, selectedBy: 20, overallRating: 72, pace: 75, shooting: 74, passing: 62, defending: 19, physical: 63 },
    // Cat 8 DEF
    { ...Z, name: 'Shajeer', teamId: bra._id, position: 'DEF', price: 4.5, selectedBy: 12, overallRating: 65, pace: 60, shooting: 35, passing: 55, defending: 70, physical: 67 },

    // ── SPAIN ─────────────────────────────────────────────────────────────
    // Icons FWD
    { ...Z, name: 'Shakeer',  teamId: esp._id, position: 'FWD', price: 9.0, selectedBy: 68, overallRating: 91, pace: 94, shooting: 94, passing: 80, defending: 29, physical: 82 },
    // Cat 1 FWD
    { ...Z, name: 'Fazlu',    teamId: esp._id, position: 'FWD', price: 7.5, selectedBy: 48, overallRating: 84, pace: 87, shooting: 88, passing: 73, defending: 23, physical: 74 },
    // GK
    { ...Z, name: 'Shukkoor', teamId: esp._id, position: 'GK',  price: 5.5, selectedBy: 30, overallRating: 76, pace: 54, shooting: 46, passing: 62, defending: 80, physical: 78 },
    // Cat 3 DEF  (second Cheppu — different person)
    { ...Z, name: 'Cheppu',   teamId: esp._id, position: 'DEF', price: 7.0, selectedBy: 44, overallRating: 80, pace: 75, shooting: 49, passing: 70, defending: 85, physical: 82 },
    // Cat 4 DEF
    { ...Z, name: 'Fayaz',    teamId: esp._id, position: 'DEF', price: 6.0, selectedBy: 32, overallRating: 76, pace: 71, shooting: 44, passing: 66, defending: 81, physical: 78 },
    // Cat 5 FWD
    { ...Z, name: 'Safdar',   teamId: esp._id, position: 'FWD', price: 6.5, selectedBy: 36, overallRating: 78, pace: 81, shooting: 81, passing: 67, defending: 22, physical: 68 },
    // Cat 6 DEF
    { ...Z, name: 'Arshad',   teamId: esp._id, position: 'DEF', price: 5.0, selectedBy: 24, overallRating: 70, pace: 65, shooting: 39, passing: 60, defending: 75, physical: 72 },
    // Cat 7 FWD
    { ...Z, name: 'Shahsad',  teamId: esp._id, position: 'FWD', price: 5.5, selectedBy: 24, overallRating: 73, pace: 76, shooting: 75, passing: 63, defending: 20, physical: 64 },
    // Cat 8 DEF
    { ...Z, name: 'Jambli',   teamId: esp._id, position: 'DEF', price: 4.5, selectedBy: 14, overallRating: 65, pace: 59, shooting: 34, passing: 54, defending: 69, physical: 66 },

    // ── GERMANY ───────────────────────────────────────────────────────────
    // Icons FWD
    { ...Z, name: 'Haris',   teamId: ger._id, position: 'FWD', price: 9.0, selectedBy: 62, overallRating: 90, pace: 92, shooting: 93, passing: 79, defending: 27, physical: 80 },
    // Cat 1 FWD
    { ...Z, name: 'Aspaq',   teamId: ger._id, position: 'FWD', price: 7.5, selectedBy: 40, overallRating: 83, pace: 86, shooting: 86, passing: 72, defending: 22, physical: 73 },
    // GK
    { ...Z, name: 'Mubeen',  teamId: ger._id, position: 'GK',  price: 5.5, selectedBy: 22, overallRating: 74, pace: 53, shooting: 44, passing: 60, defending: 78, physical: 76 },
    // Cat 3 DEF  (first Muchi)
    { ...Z, name: 'Muchi',   teamId: ger._id, position: 'DEF', price: 7.0, selectedBy: 48, overallRating: 81, pace: 76, shooting: 50, passing: 71, defending: 86, physical: 83 },
    // Cat 4 DEF  (second Muchi — different person, same nickname)
    { ...Z, name: 'Muchi',   teamId: ger._id, position: 'DEF', price: 6.0, selectedBy: 26, overallRating: 75, pace: 70, shooting: 43, passing: 65, defending: 80, physical: 77 },
    // Cat 5 FWD
    { ...Z, name: 'Badsah',  teamId: ger._id, position: 'FWD', price: 6.5, selectedBy: 32, overallRating: 77, pace: 80, shooting: 80, passing: 66, defending: 21, physical: 67 },
    // Cat 6 DEF
    { ...Z, name: 'Ramees',  teamId: ger._id, position: 'DEF', price: 5.0, selectedBy: 18, overallRating: 69, pace: 64, shooting: 38, passing: 59, defending: 74, physical: 71 },
    // Cat 7 FWD
    { ...Z, name: 'Ajju',    teamId: ger._id, position: 'FWD', price: 5.5, selectedBy: 18, overallRating: 72, pace: 75, shooting: 74, passing: 62, defending: 19, physical: 63 },
    // Cat 8 DEF
    { ...Z, name: 'Aachi',   teamId: ger._id, position: 'DEF', price: 4.5, selectedBy: 10, overallRating: 65, pace: 60, shooting: 35, passing: 55, defending: 70, physical: 67 },

    // ── FRANCE ────────────────────────────────────────────────────────────
    // Icons FWD
    { ...Z, name: 'Faqih',   teamId: fra._id, position: 'FWD', price: 9.0, selectedBy: 72, overallRating: 91, pace: 93, shooting: 95, passing: 80, defending: 28, physical: 81 },
    // Cat 1 FWD
    { ...Z, name: 'Zammi',   teamId: fra._id, position: 'FWD', price: 7.5, selectedBy: 44, overallRating: 84, pace: 87, shooting: 87, passing: 73, defending: 23, physical: 74 },
    // GK
    { ...Z, name: 'Nafiz',   teamId: fra._id, position: 'GK',  price: 5.5, selectedBy: 25, overallRating: 72, pace: 51, shooting: 42, passing: 58, defending: 76, physical: 74 },
    // Cat 3 DEF
    { ...Z, name: 'Amanu',   teamId: fra._id, position: 'DEF', price: 7.0, selectedBy: 42, overallRating: 80, pace: 75, shooting: 49, passing: 70, defending: 85, physical: 82 },
    // Cat 4 DEF
    { ...Z, name: 'Hameel',  teamId: fra._id, position: 'DEF', price: 6.0, selectedBy: 30, overallRating: 76, pace: 71, shooting: 44, passing: 66, defending: 81, physical: 78 },
    // Cat 5 FWD
    { ...Z, name: 'Waleed',  teamId: fra._id, position: 'FWD', price: 6.5, selectedBy: 38, overallRating: 78, pace: 81, shooting: 81, passing: 67, defending: 21, physical: 68 },
    // Cat 6 DEF
    { ...Z, name: 'Rammi',   teamId: fra._id, position: 'DEF', price: 5.0, selectedBy: 20, overallRating: 70, pace: 65, shooting: 39, passing: 60, defending: 75, physical: 72 },
    // Cat 7 FWD
    { ...Z, name: 'Akru',    teamId: fra._id, position: 'FWD', price: 5.5, selectedBy: 20, overallRating: 72, pace: 75, shooting: 73, passing: 61, defending: 19, physical: 63 },
    // Cat 8 DEF
    { ...Z, name: 'Nazeer',  teamId: fra._id, position: 'DEF', price: 4.5, selectedBy: 12, overallRating: 66, pace: 61, shooting: 36, passing: 56, defending: 71, physical: 68 },
  ];

  const players = await Player.insertMany(playersData);
  console.log(`Created ${players.length} players (9 per team)`);

  // ── GAMEWEEK ──────────────────────────────────────────────────────────────
  await Gameweek.insertMany([
    { number: 1, deadline: new Date('2025-07-03T18:00:00.000Z'), status: 'active', isCurrent: true },
  ]);
  console.log('Gameweek created');

  // ── FIXTURES — all July 4, each team plays twice ───────────────────────────
  await Match.insertMany([
    { gameweek: 1, homeTeam: arg._id, awayTeam: bra._id, homeScore: null, awayScore: null, status: 'scheduled', matchTime: july4(9,  0),  minute: null, events: [] },
    { gameweek: 1, homeTeam: esp._id, awayTeam: ger._id, homeScore: null, awayScore: null, status: 'scheduled', matchTime: july4(10, 30), minute: null, events: [] },
    { gameweek: 1, homeTeam: fra._id, awayTeam: arg._id, homeScore: null, awayScore: null, status: 'scheduled', matchTime: july4(12, 0),  minute: null, events: [] },
    { gameweek: 1, homeTeam: bra._id, awayTeam: esp._id, homeScore: null, awayScore: null, status: 'scheduled', matchTime: july4(13, 30), minute: null, events: [] },
    { gameweek: 1, homeTeam: ger._id, awayTeam: fra._id, homeScore: null, awayScore: null, status: 'scheduled', matchTime: july4(15, 0),  minute: null, events: [] },
  ]);
  console.log('Fixtures created (July 4, 2025 — 5 matches)');

  // ── BANNERS ───────────────────────────────────────────────────────────────
  await Banner.insertMany([
    {
      title: 'LA PERFUMES',
      subtitle: 'OFFICIAL PARTNER',
      tagline: 'Where Luxury Meets Sport',
      backgroundGradient: 'linear-gradient(135deg, #0A0A14 0%, #12121F 40%, #0D1F12 100%)',
      accentColor: '#C9A84C',
      imageUrl: '', isActive: true, order: 1,
    },
    {
      title: 'WIN AED 500',
      subtitle: 'La Perfumes Gift Voucher',
      tagline: 'Top Scorer · Every Gameweek',
      backgroundGradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1000 50%, #2A1A00 100%)',
      accentColor: '#F5D77B',
      imageUrl: '', isActive: true, order: 2,
    },
    {
      title: 'JULY 4TH',
      subtitle: 'Tournament Day',
      tagline: 'All Fixtures · One Epic Day',
      backgroundGradient: 'linear-gradient(135deg, #040A04 0%, #071407 50%, #0A1E0A 100%)',
      accentColor: '#00E676',
      imageUrl: '', isActive: true, order: 3,
    },
  ]);
  console.log('Banners created');

  // ── USERS ─────────────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin123', 12);
  const adminUser = await User.create({ name: 'Admin', email: 'admin@fantasy.com', password: adminPass, role: 'admin', teamName: 'Admin FC' });
  await User.findByIdAndUpdate(adminUser._id, { password: adminPass });
  await Squad.create({ userId: adminUser._id });

  const testPass = await bcrypt.hash('test123', 12);
  const testUser = await User.create({ name: 'Farhaz', email: 'test@fantasy.com', password: testPass, role: 'user', teamName: 'Desert Eagles FC' });
  await User.findByIdAndUpdate(testUser._id, { password: testPass });

  // Test squad: Cheppu (ARG GK) + Shalu (ARG DEF) + Shanu (BRA FWD) = 21.5M
  const squadPicks = players.filter((p) => {
    if (p.name === 'Cheppu' && String(p.teamId) === String(arg._id)) return true;  // ARG GK
    if (p.name === 'Shalu')  return true;  // ARG DEF
    if (p.name === 'Shanu')  return true;  // BRA FWD
    return false;
  });
  const squadCost = squadPicks.reduce((s, p) => s + p.price, 0);
  await Squad.create({
    userId: testUser._id,
    players: squadPicks.map((p) => p._id),
    budget: parseFloat((50 - squadCost).toFixed(1)),
    totalPoints: 0, gameweekPoints: 0, gameweek: 1, transfersRemaining: 2,
  });

  console.log('\n✓ Seed complete!');
  console.log(`  Players : ${players.length} (${players.filter(p=>p.position==='GK').length} GK · ${players.filter(p=>p.position==='DEF').length} DEF · ${players.filter(p=>p.position==='FWD').length} FWD)`);
  console.log('  Admin   : admin@fantasy.com / admin123');
  console.log('  Test    : test@fantasy.com  / test123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error('Seed error:', err); process.exit(1); });
