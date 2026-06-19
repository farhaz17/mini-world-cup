import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import FantasyPage from './pages/FantasyPage';
import PlayersPage from './pages/PlayersPage';
import Layout from './components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/"         element={<Layout><HomePage /></Layout>} />
      <Route path="/league"   element={<Layout><LeaguePage /></Layout>} />
      <Route path="/fantasy"  element={<Layout><FantasyPage /></Layout>} />
      <Route path="/players"  element={<Layout><PlayersPage /></Layout>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
