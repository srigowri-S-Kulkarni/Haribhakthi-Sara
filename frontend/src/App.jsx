import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import GlobalPlayer from './components/GlobalPlayer';

import Home from './pages/Home/Home';
import Artists from './pages/Artists/Artists';
import ArtistDetail from './pages/Artists/ArtistDetail';
import Playlists from './pages/Playlists/Playlists';
import PlaylistDetail from './pages/Playlists/PlaylistDetail';
import Search from './pages/Search/Search';
import Library from './pages/Library/Library';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <div className="flex h-screen bg-brand-dark text-white overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <Navbar />
              <main className="flex-1 overflow-y-auto pb-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/artists/:id" element={<ArtistDetail />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlists/:id" element={<PlaylistDetail />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              {/* Persistent Audio Player */}
              <GlobalPlayer />
            </div>
          </div>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
