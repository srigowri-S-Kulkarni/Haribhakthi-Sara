import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ArtistCard from '../../components/ArtistCard';
import PlaylistCard from '../../components/PlaylistCard';
import SongItem from '../../components/SongItem';
import { Play, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function Home() {
  const { t } = useTranslation();
  const { playSong } = usePlayer();
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/artists'),
      api.get('/playlists'),
      api.get('/songs')
    ]).then(([artistsRes, playlistsRes, songsRes]) => {
      setArtists(artistsRes.data);
      setPlaylists(playlistsRes.data);
      setSongs(songsRes.data);
    }).catch(err => console.error("Error loading home data", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-neutral-900 p-8 border border-amber-900/40 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-brand-accent font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{t('home.welcome')}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            {t('home.subtitle')}
          </h1>
          <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
            Discover and stream timeless Kannada devotional music, Devaranama, and Bhajans.
          </p>

          {songs.length > 0 && (
            <button
              onClick={() => playSong(songs[0], songs)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accentHover text-black font-bold rounded-full transition shadow-lg hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('player.playAll')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">{t('home.featuredArtists')}</h2>
        </div>
        {artists.length === 0 ? (
          <p className="text-neutral-500 text-sm">No artists added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artists.slice(0, 6).map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </section>

      {/* Curated Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">{t('home.curatedPlaylists')}</h2>
        </div>
        {playlists.length === 0 ? (
          <p className="text-neutral-500 text-sm">No curated playlists available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.slice(0, 5).map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Songs List */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight">{t('home.popularSongs')}</h2>
        {songs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No songs published yet.</p>
        ) : (
          <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
            {songs.slice(0, 10).map(song => (
              <SongItem key={song.id} song={song} songList={songs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
