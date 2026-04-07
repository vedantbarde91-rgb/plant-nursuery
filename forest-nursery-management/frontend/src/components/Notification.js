// Notification component - notifications are shown in the Navbar bell icon
// This file is kept for future extension (e.g. toast popups per notification)
import React from 'react';

function Notification({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#d8f3dc', border: '1px solid #95d5b2',
      borderRadius: 8, padding: '10px 16px', marginBottom: 8,
      fontSize: 13, color: '#1b4332',
    }}>
      🔔 {message}
    </div>
  );
}

export default Notification;
