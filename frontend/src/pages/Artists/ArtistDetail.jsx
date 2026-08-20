import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import SongItem from '../../components/SongItem';
import { usePlayer } from '../../context/PlayerContext';
import { Play, User, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ArtistDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { playSong } = usePlayer();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/artists/${id}`),
      api.get(`/songs/artist/${id}`)
    ]).then(([artistRes, songsRes]) => {
      setArtist(artistRes.data);
      setSongs(songsRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-neutral-500">Loading artist details...</div>;
  if (!artist) return <div className="p-8 text-neutral-500">Artist not found.</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-neutral-800/80 to-brand-dark p-6 rounded-2xl border border-neutral-800">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0 shadow-2xl border-2 border-neutral-700">
          {artist.profileImageUrl ? (
            <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-accent">Devotional Artist</span>
          <h1 className="text-4xl md:text-5xl font-black text-white">{artist.name}</h1>
          {artist.description && <p className="text-sm text-neutral-300 max-w-xl">{artist.description}</p>}
          <p className="text-xs text-neutral-400 flex items-center justify-center md:justify-start gap-1 pt-1">
            <Music className="w-3 h-3" />
            <span>{songs.length} Devotional Songs</span>
          </p>

          {songs.length > 0 && (
            <button
              onClick={() => playSong(songs[0], songs)}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accentHover text-black font-bold rounded-full transition shadow-lg hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('player.playAll')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Songs List */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Devotional Songs</h2>
        {songs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No songs uploaded for this artist yet.</p>
        ) : (
          <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
            {songs.map(song => (
              <SongItem key={song.id} song={song} songList={songs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
