import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import FantasyPage from './pages/FantasyPage';
import PlayersPage from './pages/PlayersPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/"         element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
      <Route path="/league"   element={<PrivateRoute><Layout><LeaguePage /></Layout></PrivateRoute>} />
      <Route path="/fantasy"  element={<PrivateRoute><Layout><FantasyPage /></Layout></PrivateRoute>} />
      <Route path="/players"  element={<PrivateRoute><Layout><PlayersPage /></Layout></PrivateRoute>} />
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
