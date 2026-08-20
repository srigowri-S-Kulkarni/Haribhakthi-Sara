import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Users, Disc, Search, Library, Shield, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/artists', label: t('nav.artists'), icon: Users },
    { to: '/playlists', label: t('nav.playlists'), icon: Disc },
    { to: '/search', label: t('nav.search'), icon: Search },
    { to: '/library', label: t('nav.library'), icon: Library },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: t('nav.admin'), icon: Shield });
  }

  return (
    <aside className="w-64 bg-black flex flex-col justify-between p-4 h-full border-r border-neutral-800 select-none overflow-y-auto">
      <div>
        {/* Brand Logo Header (Prominent & Centered with Back Button) */}
        <div className="flex flex-col items-center justify-center text-center px-2 py-4 mb-6 bg-neutral-950/60 rounded-2xl border border-neutral-800/80 shadow-xl relative group">
          {/* Back Button near icon */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition flex items-center justify-center shadow"
            title="Go Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-accent shadow-2xl shadow-brand-accent/40 ring-4 ring-brand-accent/20 mb-3 mt-2">
            <img src="/logo.jpg" alt="Haribhakthi Sara" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-white tracking-wide text-xl leading-tight">ಹರಿಭಕ್ತಿ ಸಾರ</h1>
            <p className="text-xs text-brand-accent font-bold tracking-wider uppercase mt-1">Haribhakthi Sara</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-hover text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-3 py-4 border-t border-neutral-800 text-xs text-neutral-500 mt-6">
        <p>Kannada Devotional Music Platform</p>
        <p className="mt-1">Phase 1 MVP</p>
      </div>
    </aside>
  );
}
