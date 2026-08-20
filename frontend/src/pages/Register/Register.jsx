import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Globe } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, language);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-brand-card border border-neutral-800 p-8 rounded-2xl max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            卐
          </div>
          <h2 className="text-2xl font-bold text-white">{t('nav.register')}</h2>
          <p className="text-xs text-neutral-400">Create your Haribhakthi Sara account</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Purandara Dasa"
                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Preferred UI Language</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none focus:border-brand-accent appearance-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-accent hover:bg-brand-accentHover text-black font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Account...' : t('nav.register')}</span>
        </button>

        <p className="text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent font-semibold hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </form>
    </div>
  );
}
