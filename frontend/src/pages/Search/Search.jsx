import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import SongItem from '../../components/SongItem';
import ArtistCard from '../../components/ArtistCard';
import { Search as SearchIcon, Music, Users } from 'lucide-react';

export default function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      setArtists([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      Promise.all([
        api.get(`/songs/search?q=${encodeURIComponent(query)}`),
        api.get('/artists')
      ]).then(([songsRes, artistsRes]) => {
        setSongs(songsRes.data);
        const filteredArtists = artistsRes.data.filter(a =>
          a.name.toLowerCase().includes(query.toLowerCase())
        );
        setArtists(filteredArtists);
      }).catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="p-8 space-y-8">
      {/* Search Input Bar */}
      <div className="relative max-w-xl">
        <SearchIcon className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full bg-neutral-900 border border-neutral-800 focus:border-brand-accent text-white pl-12 pr-4 py-3 rounded-full text-sm outline-none transition shadow-inner"
          autoFocus
        />
      </div>

      {loading ? (
        <p className="text-neutral-500">Searching catalog...</p>
      ) : !query.trim() ? (
        <div className="text-center py-16 text-neutral-500 space-y-2">
          <SearchIcon className="w-12 h-12 mx-auto text-neutral-700" />
          <p className="text-sm font-medium">Search for your favorite devotional songs or artists.</p>
        </div>
      ) : songs.length === 0 && artists.length === 0 ? (
        <p className="text-neutral-500 text-sm">{t('search.noResults')}</p>
      ) : (
        <div className="space-y-8">
          {/* Matching Artists */}
          {artists.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg">
                <Users className="w-5 h-5 text-brand-accent" />
                <span>Artists</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Matching Songs */}
          {songs.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg">
                <Music className="w-5 h-5 text-brand-accent" />
                <span>Devotional Songs</span>
              </div>
              <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
                {songs.map(song => (
                  <SongItem key={song.id} song={song} songList={songs} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
