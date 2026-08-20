import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SongItem from '../../components/SongItem';
import PlaylistCard from '../../components/PlaylistCard';
import { Library as LibraryIcon, Heart, Clock, Disc, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/favorites').then(res => setFavorites(res.data)).catch(err => console.error(err));
      api.get('/history').then(res => setHistory(res.data)).catch(err => console.error(err));
      api.get('/playlists/my').then(res => setPlaylists(res.data)).catch(err => console.error(err));
    }
  }, [user, activeTab]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const formData = new FormData();
      formData.append('name', newPlaylistName.trim());
      if (newPlaylistDesc.trim()) formData.append('description', newPlaylistDesc.trim());

      const res = await api.post('/playlists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPlaylists([...playlists, res.data]);
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
    } catch (err) {
      alert(err.response?.data?.message || "Error creating playlist");
    }
  };

  if (!user) {
    return (
      <div className="p-12 text-center max-w-md mx-auto my-12 space-y-6 bg-brand-card p-8 rounded-2xl border border-neutral-800">
        <LibraryIcon className="w-16 h-16 text-brand-accent mx-auto" />
        <h2 className="text-2xl font-bold text-white">{t('nav.library')}</h2>
        <p className="text-sm text-neutral-400 leading-relaxed">{t('library.guestPrompt')}</p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-black font-bold rounded-full transition shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('nav.login')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LibraryIcon className="w-8 h-8 text-brand-accent" />
          <h1 className="text-3xl font-extrabold text-white">{t('nav.library')}</h1>
        </div>

        {activeTab === 'playlists' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>{t('actions.createPlaylist')}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'favorites' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{t('library.likedSongs')} ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'history' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('library.recentlyPlayed')} ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
            activeTab === 'playlists' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>{t('library.personalPlaylists')} ({playlists.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && (
        <section>
          {favorites.length === 0 ? (
            <p className="text-neutral-500 text-sm">You haven't liked any songs yet.</p>
          ) : (
            <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
              {favorites.map(song => (
                <SongItem key={song.id} song={song} songList={favorites} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section>
          {history.length === 0 ? (
            <p className="text-neutral-500 text-sm">No listening history recorded yet.</p>
          ) : (
            <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
              {history.map(song => (
                <SongItem key={song.id} song={song} songList={history} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'playlists' && (
        <section>
          {playlists.length === 0 ? (
            <p className="text-neutral-500 text-sm">You haven't created any personal playlists yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {playlists.map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreatePlaylist} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Personal Playlist</h3>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Playlist Name</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="e.g. My Morning Bhajans"
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Description (Optional)</label>
              <textarea
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                placeholder="Brief description..."
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent h-20 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow"
              >
                {t('actions.save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
