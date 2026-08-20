import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function PlaylistCard({ playlist }) {
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  const handlePlayAll = (e) => {
    e.stopPropagation();
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  return (
    <div
      onClick={() => navigate(`/playlists/${playlist.id}`)}
      className="group bg-brand-card hover:bg-brand-hover p-4 rounded-xl cursor-pointer transition-all duration-300 border border-neutral-800/50 hover:border-neutral-700 relative"
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-neutral-800 mb-3 relative shadow-md">
        {playlist.coverImageUrl ? (
          <img src={playlist.coverImageUrl} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900">
            <Disc className="w-12 h-12" />
          </div>
        )}

        {/* Play Button Overlay */}
        {playlist.songs && playlist.songs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-brand-accent text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-105"
            title="Play Playlist"
          >
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </button>
        )}
      </div>

      <h3 className="font-bold text-white text-base truncate group-hover:text-brand-accent transition">
        {playlist.name}
      </h3>
      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
        {playlist.description || `${playlist.playlistType === 'CURATED' ? 'Curated Playlist' : 'Personal Playlist'}`}
      </p>
    </div>
  );
}
