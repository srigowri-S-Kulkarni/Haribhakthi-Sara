import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SongItem from '../../components/SongItem';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Play, Disc, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSong } = usePlayer();
  const { user, isAdmin } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = () => {
    api.get(`/playlists/${id}`)
      .then(res => setPlaylist(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleDeletePlaylist = async () => {
    if (confirm("Are you sure you want to delete this entire playlist?")) {
      try {
        if (playlist.playlistType === 'CURATED') {
          await api.delete(`/admin/playlists/${id}`);
        } else {
          await api.delete(`/playlists/${id}`);
        }
        navigate('/playlists');
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting playlist");
      }
    }
  };

  if (loading) return <div className="p-8 text-neutral-500">Loading playlist...</div>;
  if (!playlist) return <div className="p-8 text-neutral-500">Playlist not found.</div>;

  const canManage = (playlist.playlistType === 'PERSONAL' && user?.id === playlist.userId) || (playlist.playlistType === 'CURATED' && isAdmin);

  return (
    <div className="p-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-neutral-800/80 to-brand-dark p-6 rounded-2xl border border-neutral-800">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 shadow-2xl border border-neutral-700">
          {playlist.coverImageUrl ? (
            <img src={playlist.coverImageUrl} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              <Disc className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-accent">
            {playlist.playlistType === 'CURATED' ? 'Curated Playlist' : 'Personal Playlist'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white">{playlist.name}</h1>
          {playlist.description && <p className="text-sm text-neutral-300 max-w-xl">{playlist.description}</p>}

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            {playlist.songs && playlist.songs.length > 0 && (
              <button
                onClick={() => playSong(playlist.songs[0], playlist.songs)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accentHover text-black font-bold rounded-full transition shadow-lg hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('player.playAll')}</span>
              </button>
            )}

            {canManage && (
              <button
                onClick={handleDeletePlaylist}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-full transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Playlist</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Song List */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Songs in Playlist ({playlist.songs ? playlist.songs.length : 0})</h2>
        {!playlist.songs || playlist.songs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No songs added to this playlist yet.</p>
        ) : (
          <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
            {playlist.songs.map(song => (
              <SongItem
                key={song.id}
                song={song}
                songList={playlist.songs}
                playlistId={playlist.id}
                isCuratedPlaylist={playlist.playlistType === 'CURATED'}
                onRemoveFromPlaylist={fetchPlaylist}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
