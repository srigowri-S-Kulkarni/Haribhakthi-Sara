import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Globe, LogIn, UserPlus, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, changeLanguage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'kn' ? 'en' : 'kn';
    changeLanguage(nextLang);
  };

  return (
    <header className="h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Navigation History & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center justify-center transition"
            title="Go Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center justify-center transition"
            title="Go Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {location.pathname !== '/search' && (
          <div
            onClick={() => navigate('/search')}
            className="flex-1 flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-sm px-4 py-2 rounded-full cursor-pointer transition"
          >
            <Search className="w-4 h-4" />
            <span>{t('search.placeholder')}</span>
          </div>
        )}
      </div>

      {/* Right Controls: Language Toggle & Auth Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-brand-accent transition"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{i18n.language === 'kn' ? 'English (EN)' : 'ಕನ್ನಡ (KN)'}</span>
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-brand-accent" />
              <span className="font-medium">{user.name}</span>
              {user.role === 'ADMIN' && (
                <span className="text-[10px] bg-brand-accent text-black font-bold px-1.5 py-0.5 rounded">ADMIN</span>
              )}
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              title={t('nav.logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white hover:text-brand-accent transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.login')}</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-accent hover:bg-brand-accentHover text-black transition shadow"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('nav.register')}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
