import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SongItem from '../../components/SongItem';
import { Shield, Plus, Upload, User, Disc, Music, AlertCircle, Trash2, Users, X, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('songs');

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal display states
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [artistDesc, setArtistDesc] = useState('');
  const [artistImage, setArtistImage] = useState(null);
  const [artistModalError, setArtistModalError] = useState('');

  // Edit Artist Modal state
  const [showEditArtistModal, setShowEditArtistModal] = useState(false);
  const [editArtistId, setEditArtistId] = useState('');
  const [editArtistName, setEditArtistName] = useState('');
  const [editArtistDesc, setEditArtistDesc] = useState('');
  const [editArtistImage, setEditArtistImage] = useState(null);
  const [editArtistModalError, setEditArtistModalError] = useState('');

  const [showSongModal, setShowSongModal] = useState(false);
  const [songArtistId, setSongArtistId] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songDesc, setSongDesc] = useState('');
  const [songLyrics, setSongLyrics] = useState('');
  const [songDuration, setSongDuration] = useState(180);
  const [songAudio, setSongAudio] = useState(null);
  const [songCover, setSongCover] = useState(null);
  const [songModalError, setSongModalError] = useState('');

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistCover, setPlaylistCover] = useState(null);
  const [playlistModalError, setPlaylistModalError] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = () => {
    api.get('/artists').then(res => setArtists(res.data)).catch(() => {});
    api.get('/admin/songs').then(res => setSongs(res.data)).catch(() => {});
    api.get('/playlists').then(res => setPlaylists(res.data)).catch(() => {});
    api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="p-12 text-center text-rose-400 max-w-md mx-auto my-12 bg-rose-950/40 border border-rose-800 rounded-2xl">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-xs text-neutral-400 mt-1">Administrator privileges required to access this panel.</p>
      </div>
    );
  }

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    setArtistModalError(''); setError(''); setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', artistName.trim());
      if (artistDesc.trim()) formData.append('description', artistDesc.trim());
      if (artistImage) formData.append('image', artistImage);

      await api.post('/admin/artists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Artist created successfully!');
      setShowArtistModal(false);
      setArtistName(''); setArtistDesc(''); setArtistImage(null);
      loadData();
    } catch (err) {
      setArtistModalError(err.response?.data?.message || 'Failed to create artist.');
    }
  };

  const handleOpenEditArtistModal = (artist) => {
    setEditArtistId(artist.id);
    setEditArtistName(artist.name);
    setEditArtistDesc(artist.description || '');
    setEditArtistImage(null);
    setEditArtistModalError('');
    setShowEditArtistModal(true);
  };

  const handleUpdateArtist = async (e) => {
    e.preventDefault();
    setEditArtistModalError(''); setError(''); setMessage('');
    try {
      const formData = new FormData();
      if (editArtistName.trim()) formData.append('name', editArtistName.trim());
      if (editArtistDesc.trim()) formData.append('description', editArtistDesc.trim());
      if (editArtistImage) formData.append('image', editArtistImage);

      await api.put(`/admin/artists/${editArtistId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Artist updated / renamed successfully!');
      setShowEditArtistModal(false);
      loadData();
    } catch (err) {
      setEditArtistModalError(err.response?.data?.message || 'Failed to update artist.');
    }
  };

  const handleDeleteArtist = async (artistId, artistName) => {
    if (confirm(`Are you sure you want to delete artist "${artistName}"?`)) {
      setError(''); setMessage('');
      try {
        await api.delete(`/admin/artists/${artistId}`);
        setMessage(`Artist "${artistName}" deleted successfully.`);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete artist. Make sure all songs belonging to this artist are deleted first.');
      }
    }
  };

  const handleCreateSong = async (e) => {
    e.preventDefault();
    setSongModalError(''); setError(''); setMessage('');
    if (!songArtistId || !songAudio) {
      setSongModalError('Artist and audio file are required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('artistId', songArtistId);
      formData.append('title', songTitle.trim());
      if (songDesc.trim()) formData.append('description', songDesc.trim());
      if (songLyrics.trim()) formData.append('lyrics', songLyrics.trim());
      formData.append('duration', songDuration);
      formData.append('audio', songAudio);
      if (songCover) formData.append('cover', songCover);

      await api.post('/admin/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Song uploaded and published successfully!');
      setShowSongModal(false);
      setSongTitle(''); setSongDesc(''); setSongLyrics(''); setSongAudio(null); setSongCover(null); setSongModalError('');
      loadData();
    } catch (err) {
      setSongModalError(err.response?.data?.message || 'Failed to upload song.');
    }
  };

  const handleCreateCuratedPlaylist = async (e) => {
    e.preventDefault();
    setPlaylistModalError(''); setError(''); setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', playlistName.trim());
      if (playlistDesc.trim()) formData.append('description', playlistDesc.trim());
      if (playlistCover) formData.append('cover', playlistCover);

      await api.post('/admin/playlists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Curated playlist created!');
      setShowPlaylistModal(false);
      setPlaylistName(''); setPlaylistDesc(''); setPlaylistCover(null);
      loadData();
    } catch (err) {
      setPlaylistModalError(err.response?.data?.message || 'Failed to create playlist.');
    }
  };

  const handleDeletePlaylist = async (playlistId, playlistName) => {
    if (confirm(`Are you sure you want to delete curated playlist "${playlistName}"?`)) {
      setError(''); setMessage('');
      try {
        await api.delete(`/admin/playlists/${playlistId}`);
        setMessage(`Playlist "${playlistName}" deleted successfully.`);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete playlist.');
      }
    }
  };

  const handleToggleRole = async (userId, newRole, userName) => {
    if (confirm(`Are you sure you want to change role of user "${userName}" to ${newRole}?`)) {
      setError(''); setMessage('');
      try {
        await api.post(`/admin/users/${userId}/role?role=${newRole}`);
        setMessage(`Updated role for ${userName} to ${newRole}.`);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update user role.');
      }
    }
  };

  const handleDeleteUser = async (userId, userName, email) => {
    if (email.toLowerCase() === 'admin@haribhakthi.com') {
      alert("The primary administrator account cannot be deleted.");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete user "${userName}" (${email})? This will delete their account and personal playlists.`)) {
      setError(''); setMessage('');
      try {
        await api.delete(`/admin/users/${userId}`);
        setMessage(`User account "${userName}" deleted successfully.`);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user account.');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-accent" />
          <div>
            <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-xs text-neutral-400">Manage Artists, Songs, Playlists & Registered Users</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setArtistModalError(''); setShowArtistModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-full transition"
          >
            <User className="w-4 h-4 text-brand-accent" />
            <span>+ Add Artist</span>
          </button>

          <button
            onClick={() => { setPlaylistModalError(''); setShowPlaylistModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-full transition"
          >
            <Disc className="w-4 h-4 text-brand-accent" />
            <span>+ Create Playlist</span>
          </button>

          <button
            onClick={() => { setSongModalError(''); setShowSongModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full transition shadow"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Song</span>
          </button>
        </div>
      </div>

      {message && <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">{message}</div>}
      {error && <div className="p-3 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold">{error}</div>}

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('songs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'songs' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>All Songs ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'artists' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Artists ({artists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'playlists' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Curated Playlists ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'users' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Registered Users ({users.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'songs' && (
        <section className="space-y-2">
          {songs.length === 0 ? (
            <p className="text-neutral-500 text-sm">No songs uploaded yet.</p>
          ) : (
            <div className="space-y-1 bg-brand-card/50 p-2 rounded-xl border border-neutral-800/40">
              {songs.map(song => (
                <SongItem key={song.id} song={song} songList={songs} onStatusChange={loadData} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'artists' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map(artist => (
            <div key={artist.id} className="bg-brand-card p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden flex-shrink-0">
                  {artist.profileImageUrl ? (
                    <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 m-3 text-neutral-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{artist.name}</h4>
                  <p className="text-xs text-neutral-400">{artist.songCount} songs</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditArtistModal(artist)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                  title="Edit / Rename Artist"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteArtist(artist.id, artist.name)}
                  className="p-2 text-rose-500 hover:bg-rose-950/60 rounded-lg transition border border-transparent hover:border-rose-800"
                  title="Delete Artist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {activeTab === 'playlists' && (
        <section className="space-y-4">
          <button
            onClick={() => { setPlaylistModalError(''); setShowPlaylistModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Curated Playlist</span>
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map(pl => (
              <div key={pl.id} className="bg-brand-card p-4 rounded-xl border border-neutral-800 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm truncate">{pl.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{pl.songs ? pl.songs.length : 0} songs</p>
                </div>

                <button
                  onClick={() => handleDeletePlaylist(pl.id, pl.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-950/60 rounded-lg transition border border-transparent hover:border-rose-800 ml-2"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="space-y-4">
          <div className="overflow-x-auto bg-brand-card/50 rounded-xl border border-neutral-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Language</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-900/60 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-brand-accent font-bold">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-neutral-300 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.role === 'ADMIN' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-neutral-800 text-neutral-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 uppercase text-neutral-400 font-mono">{u.preferredLanguage || 'en'}</td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      {u.role === 'USER' ? (
                        <button
                          onClick={() => handleToggleRole(u.id, 'ADMIN', u.name)}
                          className="px-3 py-1 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 text-[10px] font-bold rounded-full transition"
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleRole(u.id, 'USER', u.name)}
                          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[10px] font-bold rounded-full transition"
                        >
                          Demote to User
                        </button>
                      )}

                      {u.email !== 'admin@haribhakthi.com' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name, u.email)}
                          className="p-1.5 text-rose-500 hover:bg-rose-950/60 rounded-lg transition border border-transparent hover:border-rose-800"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Add Artist Modal */}
      {showArtistModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateArtist} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add New Devotional Artist</h3>
            
            {artistModalError && (
              <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{artistModalError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Artist Name *</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. Purandara Dasa"
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Description</label>
              <textarea
                value={artistDesc}
                onChange={(e) => setArtistDesc(e.target.value)}
                placeholder="Bio or details..."
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent h-20 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Profile Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArtistImage(e.target.files[0])}
                className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowArtistModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow"
              >
                {t('actions.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit / Rename Artist Modal */}
      {showEditArtistModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateArtist} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-brand-accent" />
              <span>Edit / Rename Devotional Artist</span>
            </h3>

            {editArtistModalError && (
              <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{editArtistModalError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Artist Name *</label>
              <input
                type="text"
                value={editArtistName}
                onChange={(e) => setEditArtistName(e.target.value)}
                placeholder="e.g. Purandara Dasa"
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Description</label>
              <textarea
                value={editArtistDesc}
                onChange={(e) => setEditArtistDesc(e.target.value)}
                placeholder="Bio or details..."
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent h-20 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">New Profile Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditArtistImage(e.target.files[0])}
                className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditArtistModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Song Modal (Compact & Sticky Footer) */}
      {showSongModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateSong} className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand-accent" />
                <span>Upload New Devotional Song</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSongModal(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3.5 text-xs">
              {songModalError && (
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-300 font-semibold flex items-center gap-2 shadow-lg">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{songModalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-400 mb-1 block">Select Artist *</label>
                  <select
                    value={songArtistId}
                    onChange={(e) => setSongArtistId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-accent"
                    required
                  >
                    <option value="">-- Choose Artist --</option>
                    {artists.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-400 mb-1 block">Song Title *</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Jagadoddharana"
                    className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-accent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-400 mb-1 block">Description</label>
                <textarea
                  value={songDesc}
                  onChange={(e) => setSongDesc(e.target.value)}
                  placeholder="Devaranama details..."
                  className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-accent h-12 resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-400 mb-1 block">Song Lyrics (Kannada / English)</label>
                <textarea
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                  placeholder="Enter song lyrics line by line..."
                  className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-accent h-20 font-sans resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-400 mb-1 block">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={songDuration}
                    onChange={(e) => setSongDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-400 mb-1 block">Audio File (.mp3) *</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSongAudio(e.target.files[0])}
                    className="text-[11px] text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-400 mb-1 block">Cover Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSongCover(e.target.files[0])}
                  className="text-[11px] text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowSongModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow-lg transition"
              >
                Upload Song
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Curated Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateCuratedPlaylist} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Curated Public Playlist</h3>

            {playlistModalError && (
              <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{playlistModalError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Playlist Name *</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="e.g. Dasa Sahitya Classics"
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Description</label>
              <textarea
                value={playlistDesc}
                onChange={(e) => setPlaylistDesc(e.target.value)}
                placeholder="Playlist description..."
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-brand-accent h-20 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 mb-1 block">Cover Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPlaylistCover(e.target.files[0])}
                className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPlaylistModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-black text-xs font-bold rounded-full shadow"
              >
                {t('actions.save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
