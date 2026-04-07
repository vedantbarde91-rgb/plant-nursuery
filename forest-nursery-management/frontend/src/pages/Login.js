import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import toast from 'react-hot-toast';

function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Staff' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await loginUser({ email: form.email, password: form.password });
        toast.success(`Welcome back, ${data.name}!`);
        onLogin(data);
      } else {
        const { data } = await registerUser(form);
        toast.success('Registered successfully!');
        onLogin(data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    },
    card: {
      background: '#fff', borderRadius: 20,
      padding: '44px 40px', width: '100%', maxWidth: 420,
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    },
    logo: { textAlign: 'center', marginBottom: 28 },
    logoEmoji: { fontSize: 52 },
    logoTitle: { fontSize: 22, fontWeight: 800, color: '#1b4332', marginTop: 8 },
    logoSub: { fontSize: 13, color: '#6b9080', marginTop: 4 },
    tabs: { display: 'flex', background: '#f0f4f0', borderRadius: 10, padding: 4, marginBottom: 28 },
    tab: (active) => ({
      flex: 1, padding: '9px 0', border: 'none', borderRadius: 8,
      cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
      background: active ? '#2d6a4f' : 'transparent',
      color: active ? '#fff' : '#6b9080',
    }),
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 },
    input: {
      width: '100%', padding: '11px 14px', borderRadius: 10,
      border: '1.5px solid #d1e8d1', fontSize: 14, outline: 'none',
      marginBottom: 16, background: '#fafff9', boxSizing: 'border-box',
      transition: 'border 0.2s',
    },
    select: {
      width: '100%', padding: '11px 14px', borderRadius: 10,
      border: '1.5px solid #d1e8d1', fontSize: 14, outline: 'none',
      marginBottom: 16, background: '#fafff9', boxSizing: 'border-box',
    },
    btn: {
      width: '100%', padding: '13px', background: '#2d6a4f',
      color: '#fff', border: 'none', borderRadius: 10,
      fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4,
      transition: 'background 0.2s',
    },
    hint: {
      marginTop: 20, padding: 14, background: '#f0f7f0',
      borderRadius: 10, fontSize: 12, color: '#555', textAlign: 'center',
      lineHeight: 1.8,
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoEmoji}>🌲</div>
          <div style={s.logoTitle}>Forest Nursery</div>
          <div style={s.logoSub}>Department Management System</div>
        </div>

        <div style={s.tabs}>
          <button style={s.tab(mode === 'login')} onClick={() => setMode('login')}>Login</button>
          <button style={s.tab(mode === 'register')} onClick={() => setMode('register')}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label style={s.label}>Full Name</label>
              <input style={s.input} name="name" placeholder="Enter your name"
                value={form.name} onChange={handleChange} required />
              <label style={s.label}>Role</label>
              <select style={s.select} name="role" value={form.role} onChange={handleChange}>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </>
          )}
          <label style={s.label}>Email Address</label>
          <input style={s.input} name="email" type="email" placeholder="Enter email"
            value={form.email} onChange={handleChange} required />
          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" placeholder="Enter password"
            value={form.password} onChange={handleChange} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Login' : '✅ Register'}
          </button>
        </form>

        {mode === 'login' && (
          <div style={s.hint}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin@nursery.com / admin123<br />
            Staff: staff@nursery.com / staff123
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
