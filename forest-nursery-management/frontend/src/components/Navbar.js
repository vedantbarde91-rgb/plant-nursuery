import React, { useState, useEffect } from 'react';
import { getMessages, markAllRead } from '../services/api';

function Navbar({ user, onLogout, onToggleSidebar }) {
  const [messages, setMessages] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const unread = messages.filter(m => !m.isRead).length;

  const handleMarkAll = async () => {
    await markAllRead();
    fetchMessages();
  };

  const s = {
    navbar: {
      background: '#fff',
      borderBottom: '1px solid #e8f0e8',
      padding: '0 24px',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    left: { display: 'flex', alignItems: 'center', gap: 12 },
    menuBtn: {
      background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
      color: '#2d6a4f', padding: '4px 8px', borderRadius: 6,
    },
    title: { fontSize: 18, fontWeight: 700, color: '#1b4332' },
    right: { display: 'flex', alignItems: 'center', gap: 16 },
    bellWrap: { position: 'relative' },
    bell: {
      background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
      position: 'relative', padding: 4,
    },
    badge: {
      position: 'absolute', top: -2, right: -2,
      background: '#e63946', color: '#fff',
      fontSize: 10, fontWeight: 700,
      borderRadius: '50%', width: 18, height: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    dropdown: {
      position: 'absolute', top: 42, right: 0,
      background: '#fff', border: '1px solid #e0e0e0',
      borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      width: 320, zIndex: 200, maxHeight: 380, overflowY: 'auto',
    },
    dropHead: {
      padding: '12px 16px', borderBottom: '1px solid #eee',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontWeight: 600, fontSize: 14, color: '#1b4332',
    },
    markBtn: {
      fontSize: 11, color: '#2d6a4f', cursor: 'pointer',
      background: 'none', border: 'none', fontWeight: 600,
    },
    msgItem: (isRead) => ({
      padding: '10px 16px', borderBottom: '1px solid #f5f5f5',
      background: isRead ? '#fff' : '#f0f7f4', cursor: 'pointer',
    }),
    msgTitle: { fontSize: 13, fontWeight: 600, color: '#1b4332' },
    msgBody: { fontSize: 11, color: '#666', marginTop: 3, whiteSpace: 'pre-wrap' },
    msgTime: { fontSize: 10, color: '#aaa', marginTop: 3 },
    userChip: {
      background: '#e8f5e9', color: '#1b4332',
      padding: '6px 12px', borderRadius: 20,
      fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 6,
    },
    logoutBtn: {
      background: '#e63946', color: '#fff', border: 'none',
      padding: '7px 14px', borderRadius: 8,
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
    },
  };

  return (
    <div style={s.navbar}>
      <div style={s.left}>
        <button style={s.menuBtn} onClick={onToggleSidebar}>☰</button>
        <span style={s.title}>🌿 Forest Nursery Management</span>
      </div>
      <div style={s.right}>
        {/* Notification Bell */}
        <div style={s.bellWrap}>
          <button style={s.bell} onClick={() => setShowDrop(!showDrop)}>
            🔔
            {unread > 0 && <span style={s.badge}>{unread}</span>}
          </button>
          {showDrop && (
            <div style={s.dropdown}>
              <div style={s.dropHead}>
                <span>Notifications ({unread} unread)</span>
                {unread > 0 && <button style={s.markBtn} onClick={handleMarkAll}>Mark all read</button>}
              </div>
              {messages.length === 0 && (
                <div style={{ padding: 16, color: '#999', fontSize: 13, textAlign: 'center' }}>No notifications</div>
              )}
              {messages.map(m => (
                <div key={m._id} style={s.msgItem(m.isRead)}>
                  <div style={s.msgTitle}>
                    {!m.isRead && '🔵 '}{m.title}
                  </div>
                  <div style={s.msgBody}>{m.body.slice(0, 120)}...</div>
                  <div style={s.msgTime}>{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={s.userChip}>👤 {user?.name} ({user?.role})</div>
        <button style={s.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
