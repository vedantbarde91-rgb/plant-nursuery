import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Inward from './pages/Inward';
import Outward from './pages/Outward';
import Delivery from './pages/Delivery';
import Reports from './pages/Reports';
import Attendance from './pages/Attendance';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nurseryUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData) => {
    localStorage.setItem('nurseryUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nurseryUser');
    setUser(null);
  };

  if (!user) return <Login onLogin={login} />;

  return (
    <Router>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f0' }}>
        <Sidebar open={sidebarOpen} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? 240 : 0, transition: 'margin 0.3s' }}>
          <Navbar user={user} onLogout={logout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main style={{ padding: '24px', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inward" element={<Inward />} />
              <Route path="/outward" element={<Outward />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
