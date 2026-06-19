import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', teamName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[430px]">
        <div className="text-center mb-8">
          <div className="font-cool text-4xl text-dark mb-1">Fantasy</div>
          <div className="font-cool text-4xl mint-gradient-text">League</div>
          <div className="text-xs text-gray-400 mt-1">Powered by La Perfumes</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EEEFF2] shadow-sm p-6">
          <h2 className="text-lg font-semibold text-dark mb-4">Create Account</h2>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Al Blooshi' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { name: 'teamName', label: 'Team Name', type: 'text', placeholder: 'Desert Eagles FC' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full border border-[#EEEFF2] rounded-xl px-4 py-3 text-sm outline-none focus:border-mint transition-colors"
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full mint-gradient text-dark font-semibold py-3 rounded-xl transition-opacity disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-mint font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
