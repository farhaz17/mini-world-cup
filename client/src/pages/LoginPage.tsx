import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[430px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-cool text-4xl text-dark mb-1">Fantasy</div>
          <div className="font-cool text-4xl mint-gradient-text">League</div>
          <div className="text-xs text-gray-400 mt-1">Powered by La Perfumes</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EEEFF2] shadow-sm p-6">
          <h2 className="text-lg font-semibold text-dark mb-4">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#EEEFF2] rounded-xl px-4 py-3 text-sm outline-none focus:border-mint transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#EEEFF2] rounded-xl px-4 py-3 text-sm outline-none focus:border-mint transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mint-gradient text-dark font-semibold py-3 rounded-xl transition-opacity disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-mint font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
