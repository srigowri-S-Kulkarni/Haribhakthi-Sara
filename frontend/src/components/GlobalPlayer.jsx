import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX, Music, FileText } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const getFullUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8080${url}`;
};

export default function GlobalPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isRepeat,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    changeVolume,
    toggleRepeat
  } = usePlayer();

  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentSong) return null;

  const coverUrl = getFullUrl(currentSong.coverImageUrl);

  return (
    <>
      {/* Floating Lyrics Drawer */}
      {showLyrics && (
        <div className="fixed bottom-24 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] max-h-[65vh] bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/60">
            <div className="flex items-center gap-2 text-brand-accent">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">Lyrics</h3>
            </div>
            <button
              onClick={() => setShowLyrics(false)}
              className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Song Info Banner */}
          <div className="px-5 pt-3 pb-2 border-b border-neutral-800/40 bg-gradient-to-r from-neutral-900 to-neutral-950">
            <h4 className="font-extrabold text-white text-base leading-tight truncate">{currentSong.title}</h4>
            <p className="text-xs text-brand-accent font-semibold mt-0.5 truncate">{currentSong.artistName}</p>
          </div>

          {/* Lyrics Body */}
          <div className="p-6 overflow-y-auto flex-1 font-sans text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap select-text">
            {currentSong.lyrics && currentSong.lyrics.trim() ? (
              <p className="leading-loose font-medium text-base tracking-wide text-neutral-100">
                {currentSong.lyrics}
              </p>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No lyrics added for this song yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent Audio Player Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-950 border-t border-neutral-800 px-4 flex items-center justify-between z-50 select-none">
        {/* 1. Song & Artist Metadata */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
          <div className="w-12 h-12 rounded overflow-hidden bg-neutral-800 flex-shrink-0 flex items-center justify-center border border-neutral-800">
            {coverUrl ? (
              <img src={coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-6 h-6 text-neutral-500" />
            )}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-semibold text-white truncate">{currentSong.title}</h4>
            <p className="text-xs text-neutral-400 truncate">{currentSong.artistName}</p>
          </div>
        </div>

        {/* 2. Audio Playback Controls & Seek Bar */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-4">
          <div className="flex items-center gap-6 mb-1">
            <button
              onClick={toggleRepeat}
              className={`p-1 rounded transition ${isRepeat ? 'text-brand-accent' : 'text-neutral-400 hover:text-white'}`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
            <button
              onClick={previousSong}
              className="text-neutral-300 hover:text-white transition"
              title="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition shadow-lg"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
            </button>
            <button
              onClick={nextSong}
              className="text-neutral-300 hover:text-white transition"
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 text-[11px] text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-accent hover:h-1.5 transition-all"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 3. Lyrics & Volume Control */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${showLyrics ? 'bg-brand-accent text-black font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
            title="Toggle Lyrics"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Lyrics</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeVolume(volume === 0 ? 0.8 : 0)}
              className="text-neutral-400 hover:text-white transition"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
          </div>
        </div>
      </footer>
    </>
  );
}
