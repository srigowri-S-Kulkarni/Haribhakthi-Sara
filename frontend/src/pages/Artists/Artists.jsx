import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ArtistCard from '../../components/ArtistCard';
import { Users } from 'lucide-react';

export default function Artists() {
  const { t } = useTranslation();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/artists')
      .then(res => setArtists(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-brand-accent" />
        <h1 className="text-3xl font-extrabold text-white">{t('nav.artists')}</h1>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading artists...</p>
      ) : artists.length === 0 ? (
        <p className="text-neutral-500">No artists found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
