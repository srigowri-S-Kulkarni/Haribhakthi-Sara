import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Play, Pause, Heart, Plus, Trash2, RefreshCw, AlertTriangle, Music, Check, MinusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function formatDuration(sec) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const getFullUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8080${url}`;
};

export default function SongItem({
  song,
  songList = [],
  onStatusChange,
  playlistId,
  isCuratedPlaylist,
  onRemoveFromPlaylist
}) {
  const { t } = useTranslation();
  const { currentSong, isPlaying, playSong, togglePlayPause } = usePlayer();
  const { user, isAdmin } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState([]);
  const [initialPlaylistIds, setInitialPlaylistIds] = useState([]);
  const [isSavingPlaylists, setIsSavingPlaylists] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const coverUrl = getFullUrl(song.coverImageUrl);

  useEffect(() => {
    if (user && song.status === 'ACTIVE') {
      api.get(`/favorites/${song.id}/check`)
        .then(res => setIsFav(res.data.isFavorite))
        .catch(() => {});
    }
  }, [user, song.id]);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song, songList);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      setShowGuestPrompt(true);
      return;
    }
    try {
      if (isFav) {
        await api.delete(`/favorites/${song.id}`);
        setIsFav(false);
      } else {
        await api.post(`/favorites/${song.id}`);
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPlaylists = async () => {
    if (!user) {
      setShowGuestPrompt(true);
      return;
    }
    if (showPlaylistMenu) {
      setShowPlaylistMenu(false);
      return;
    }
    try {
      const personalRes = await api.get('/playlists/my');
      let combined = (personalRes.data || []).map(p => ({ ...p, isCurated: p.playlistType === 'CURATED' }));

      if (isAdmin) {
        const curatedRes = await api.get('/playlists');
        const curatedList = (curatedRes.data || []).map(p => ({ ...p, isCurated: true }));
        
        const existingIds = new Set(combined.map(p => p.id));
        const newCurated = curatedList.filter(p => !existingIds.has(p.id));
        combined = [...newCurated, ...combined];
      }

      // Detect playlists already containing this song
      const containingIds = combined
        .filter(pl => pl.songs && pl.songs.some(s => s.id === song.id))
        .map(pl => pl.id);

      setSelectedPlaylistIds(containingIds);
      setInitialPlaylistIds(containingIds);
      setUserPlaylists(combined);
      setShowPlaylistMenu(true);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlaylistSelection = (plId) => {
    setSelectedPlaylistIds(prev => 
      prev.includes(plId) ? prev.filter(id => id !== plId) : [...prev, plId]
    );
  };

  const handleSavePlaylists = async () => {
    setIsSavingPlaylists(true);
    try {
      const toAdd = selectedPlaylistIds.filter(id => !initialPlaylistIds.includes(id));
      const toRemove = initialPlaylistIds.filter(id => !selectedPlaylistIds.includes(id));

      for (const plId of toAdd) {
        const pl = userPlaylists.find(p => p.id === plId);
        if (pl) {
          if (pl.isCurated || pl.playlistType === 'CURATED') {
            await api.post(`/admin/playlists/${plId}/songs/${song.id}`);
          } else {
            await api.post(`/playlists/${plId}/songs/${song.id}`);
          }
        }
      }

      for (const plId of toRemove) {
        const pl = userPlaylists.find(p => p.id === plId);
        if (pl) {
          if (pl.isCurated || pl.playlistType === 'CURATED') {
            await api.delete(`/admin/playlists/${plId}/songs/${song.id}`);
          } else {
            await api.delete(`/playlists/${plId}/songs/${song.id}`);
          }
        }
      }

      setAddedMessage(`Playlists updated!`);
      setTimeout(() => setAddedMessage(''), 2500);
      setShowPlaylistMenu(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating playlists");
    } finally {
      setIsSavingPlaylists(false);
    }
  };

  const handleRemoveFromPlaylist = async () => {
    try {
      if (isCuratedPlaylist) {
        await api.delete(`/admin/playlists/${playlistId}/songs/${song.id}`);
      } else {
        await api.delete(`/playlists/${playlistId}/songs/${song.id}`);
      }
      if (onRemoveFromPlaylist) onRemoveFromPlaylist();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing song from playlist");
    }
  };

  const handleSoftDelete = async () => {
    if (confirm("Deactivate this song? It will be hidden from public users.")) {
      await api.post(`/admin/songs/${song.id}/deactivate`);
      if (onStatusChange) onStatusChange();
    }
  };

  const handleRestore = async () => {
    await api.post(`/admin/songs/${song.id}/restore`);
    if (onStatusChange) onStatusChange();
  };

  const handlePermanentDelete = async () => {
    if (confirm("PERMANENTLY DELETE this song? This action cannot be undone and will delete physical files!")) {
      await api.delete(`/admin/songs/${song.id}/permanent`);
      if (onStatusChange) onStatusChange();
    }
  };

  return (
    <div className={`group flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-neutral-900 transition ${isCurrent ? 'bg-neutral-900/90' : ''}`}>
      {/* Song Metadata */}
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
        <button
          onClick={handlePlay}
          className="w-10 h-10 rounded overflow-hidden bg-neutral-800 flex-shrink-0 relative group/btn"
        >
          {coverUrl ? (
            <img src={coverUrl} alt={song.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              <Music className="w-5 h-5" />
            </div>
          )}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover/btn:opacity-100'}`}>
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 text-brand-accent fill-current" />
            ) : (
              <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
            )}
          </div>
        </button>

        <div className="truncate">
          <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-brand-accent' : 'text-white'}`}>
            {song.title}
          </h4>
          <p className="text-xs text-neutral-400 truncate">{song.artistName}</p>
        </div>
      </div>

      {/* Actions & Duration */}
      <div className="flex items-center gap-3">
        {addedMessage && (
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-800">
            <Check className="w-3 h-3" />
            {addedMessage}
          </span>
        )}

        {/* Status Badge for Admin */}
        {isAdmin && !playlistId && (
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${song.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
            {song.status}
          </span>
        )}

        {/* Favorite Button */}
        {song.status === 'ACTIVE' && (
          <button
            onClick={handleFavoriteToggle}
            className={`p-1.5 rounded-full hover:bg-neutral-800 transition ${isFav ? 'text-rose-500' : 'text-neutral-500 hover:text-white'}`}
            title={t('actions.like')}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Add to Playlist Multi-select Dropdown */}
        {song.status === 'ACTIVE' && !playlistId && (
          <div className="relative">
            <button
              onClick={handleOpenPlaylists}
              className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-full transition"
              title={t('actions.addToList')}
            >
              <Plus className="w-4 h-4" />
            </button>

            {showPlaylistMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-30 text-xs overflow-hidden">
                <div className="px-3 py-2 text-neutral-400 font-semibold border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                  <span>Add to Playlists</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Multi-select</span>
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-neutral-800/40">
                  {userPlaylists.length === 0 ? (
                    <p className="px-3 py-3 text-neutral-500 text-center">No playlists found</p>
                  ) : (
                    userPlaylists.map(pl => {
                      const isChecked = selectedPlaylistIds.includes(pl.id);
                      return (
                        <div
                          key={pl.id}
                          onClick={() => togglePlaylistSelection(pl.id)}
                          className="px-3 py-2.5 hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 accent-brand-accent rounded cursor-pointer"
                            />
                            <span className={`truncate text-xs ${isChecked ? 'text-white font-semibold' : 'text-neutral-300'}`}>
                              {pl.name}
                            </span>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${pl.isCurated ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-neutral-800 text-neutral-400'}`}>
                            {pl.isCurated ? 'CURATED' : 'PERSONAL'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {userPlaylists.length > 0 && (
                  <div className="p-2 border-t border-neutral-800 bg-neutral-950">
                    <button
                      onClick={handleSavePlaylists}
                      disabled={isSavingPlaylists}
                      className="w-full py-2 bg-brand-accent hover:bg-brand-accentHover text-black font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-1.5"
                    >
                      {isSavingPlaylists ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply ({selectedPlaylistIds.length} selected)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Context-Specific Actions: Remove from Playlist OR Admin System Delete */}
        {playlistId ? (
          /* Inside Playlist View: Remove Song from Playlist Option */
          ((isCuratedPlaylist && isAdmin) || (!isCuratedPlaylist && user)) && (
            <button
              onClick={handleRemoveFromPlaylist}
              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/50 rounded transition"
              title="Remove from Playlist"
            >
              <MinusCircle className="w-4 h-4 text-rose-400" />
            </button>
          )
        ) : (
          /* Global Admin View: System-wide soft & permanent delete */
          isAdmin && (
            <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
              {song.status === 'ACTIVE' ? (
                <button
                  onClick={handleSoftDelete}
                  className="p-1.5 text-amber-500 hover:bg-amber-950/50 rounded transition"
                  title={t('actions.deactivate')}
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRestore}
                  className="p-1.5 text-emerald-400 hover:bg-emerald-950/50 rounded transition"
                  title={t('actions.restore')}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handlePermanentDelete}
                className="p-1.5 text-rose-500 hover:bg-rose-950/50 rounded transition"
                title={t('actions.permanentDelete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )
        )}

        <span className="text-xs text-neutral-400 min-w-[40px] text-right font-mono">
          {formatDuration(song.durationSeconds)}
        </span>
      </div>

      {/* Guest Login Modal Prompt */}
      {showGuestPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl max-w-sm w-full text-center">
            <Heart className="w-12 h-12 text-brand-accent mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Login Required</h3>
            <p className="text-xs text-neutral-400 mb-6">{t('player.guestNotice')}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowGuestPrompt(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t('actions.cancel')}
              </button>
              <a
                href="/login"
                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow"
              >
                {t('nav.login')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
