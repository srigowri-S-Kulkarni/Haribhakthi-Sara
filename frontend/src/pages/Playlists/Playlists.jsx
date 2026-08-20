import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import PlaylistCard from '../../components/PlaylistCard';
import { Disc } from 'lucide-react';

export default function Playlists() {
  const { t } = useTranslation();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/playlists')
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Disc className="w-8 h-8 text-brand-accent" />
        <h1 className="text-3xl font-extrabold text-white">{t('nav.playlists')}</h1>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-neutral-500">No public curated playlists available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
