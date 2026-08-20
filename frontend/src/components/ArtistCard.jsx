import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Music } from 'lucide-react';

export default function ArtistCard({ artist }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artists/${artist.id}`)}
      className="group bg-brand-card hover:bg-brand-hover p-4 rounded-xl cursor-pointer transition-all duration-300 border border-neutral-800/50 hover:border-neutral-700"
    >
      <div className="w-full aspect-square rounded-full overflow-hidden bg-neutral-800 mb-4 relative shadow-md">
        {artist.profileImageUrl ? (
          <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <User className="w-12 h-12" />
          </div>
        )}
      </div>
      <h3 className="font-bold text-white text-base truncate group-hover:text-brand-accent transition">
        {artist.name}
      </h3>
      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
        <Music className="w-3 h-3" />
        <span>{artist.songCount} Devotional Songs</span>
      </p>
    </div>
  );
}
