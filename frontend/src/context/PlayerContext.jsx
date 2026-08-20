import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

const PlayerContext = createContext();

const getFullUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8080${url}`;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isRepeat, setIsRepeat] = useState(false);
  const historyRecordedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      if (audio.currentTime > 15 && !historyRecordedRef.current && currentSong) {
        historyRecordedRef.current = true;
        api.post('/history', { songId: currentSong.id, progress: Math.floor(audio.currentTime), completed: false })
          .catch(() => {});
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong?.durationSeconds || 0);
    };

    const handleEnded = () => {
      if (currentSong) {
        api.post('/history', { songId: currentSong.id, progress: Math.floor(audio.duration || 0), completed: true })
          .catch(() => {});
      }

      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Repeat error:", err));
      } else {
        nextSong();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, currentIndex, queue, isRepeat]);

  const playSong = (song, songList = []) => {
    if (!song) return;

    let newQueue = songList.length > 0 ? songList : [song];
    let index = newQueue.findIndex(s => s.id === song.id);
    if (index === -1) {
      newQueue = [song, ...newQueue];
      index = 0;
    }

    setQueue(newQueue);
    setCurrentIndex(index);
    setCurrentSong(song);
    historyRecordedRef.current = false;

    const audio = audioRef.current;
    const fullStreamUrl = getFullUrl(song.streamUrl);
    
    if (audio.src !== fullStreamUrl) {
      audio.src = fullStreamUrl;
    }
    
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error("Playback error:", err);
        setIsPlaying(false);
      });
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Toggle play error:", err));
    }
  };

  const nextSong = () => {
    if (queue.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    playSong(queue[nextIdx], queue);
  };

  const previousSong = () => {
    if (queue.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIdx], queue);
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      queue,
      currentIndex,
      currentTime,
      duration,
      volume,
      isRepeat,
      playSong,
      togglePlayPause,
      nextSong,
      previousSong,
      seekTo,
      changeVolume,
      toggleRepeat
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
