import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/inventory', label: 'Inventory', icon: '🌿' },
  { path: '/inward', label: 'Inward Stock', icon: '📥' },
  { path: '/outward', label: 'Outward Stock', icon: '📤' },
  { path: '/delivery', label: 'Delivery', icon: '🚛' },
  { path: '/attendance', label: 'Attendance', icon: '📋' },
  { path: '/reports', label: 'Reports', icon: '📊' },
];

const styles = {
  sidebar: {
    width: 240,
    background: 'linear-gradient(180deg, #1b4332 0%, #2d6a4f 100%)',
    color: '#fff',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
  },
  logo: {
    padding: '24px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoTitle: {
    fontSize: 16, fontWeight: 700, color: '#95d5b2',
    letterSpacing: 0.5,
  },
  logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  nav: { flex: 1, padding: '12px 0', overflowY: 'auto' },
  link: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 20px', color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none', fontSize: 14, fontWeight: 500,
    transition: 'all 0.2s', borderLeft: '3px solid transparent',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    borderLeft: '3px solid #95d5b2',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: 11, color: 'rgba(255,255,255,0.4)',
  },
};

function Sidebar({ open }) {
  if (!open) return null;
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🌲</div>
        <div style={styles.logoTitle}>Forest Nursery</div>
        <div style={styles.logoSub}>Management System</div>
      </div>
      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={styles.footer}>
        Forest Dept. © {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default Sidebar;
