import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getDashboardStats } from '../services/api';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}`,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#1b4332' }}>{value}</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 18, color: '#2d6a4f' }}>⏳ Loading dashboard...</div>;

  // Build chart data
  const chartData = months.map((m, i) => {
    const inw = stats?.monthlyInward?.find(x => x._id.month === i + 1);
    const outw = stats?.monthlyOutward?.find(x => x._id.month === i + 1);
    return { month: m, Inward: inw?.total || 0, Outward: outw?.total || 0 };
  });

  return (
    <div>
      <h2 style={{ color: '#1b4332', marginBottom: 6, fontSize: 22, fontWeight: 700 }}>📊 Dashboard</h2>
      <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>Overview of nursery operations</p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="🌿" label="Total Plants in Stock" value={stats?.totalPlants || 0} color="#2d6a4f" />
        <StatCard icon="🌱" label="Total Species" value={stats?.totalSpecies || 0} color="#52b788" />
        <StatCard icon="🚛" label="Total Deliveries" value={stats?.totalDeliveries || 0} color="#1a936f" />
        <StatCard icon="⏳" label="Pending Deliveries" value={stats?.pendingDeliveries || 0} color="#f4a261" />
        <StatCard icon="📍" label="Total Sites" value={stats?.totalSites || 0} color="#e76f51" />
      </div>

      {/* Chart */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 28 }}>
        <h3 style={{ marginBottom: 20, color: '#1b4332', fontWeight: 700 }}>📈 Monthly Inward vs Outward</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Inward" fill="#52b788" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Outward" fill="#f4a261" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent deliveries */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: 16, color: '#1b4332', fontWeight: 700 }}>🚛 Recent Deliveries</h3>
        {stats?.recentDeliveries?.length === 0
          ? <p style={{ color: '#aaa' }}>No deliveries yet.</p>
          : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f0f7f0' }}>
                  {['Delivery ID', 'Site', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentDeliveries.map(d => (
                  <tr key={d._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{d.deliveryId}</td>
                    <td style={{ padding: '10px 12px' }}>{d.siteName}</td>
                    <td style={{ padding: '10px 12px' }}>{new Date(d.deliveryDate).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: d.status === 'Delivered' ? '#d8f3dc' : d.status === 'Pending' ? '#fff3cd' : '#fde8e8',
                        color: d.status === 'Delivered' ? '#1b4332' : d.status === 'Pending' ? '#856404' : '#c0392b',
                      }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
}

export default Dashboard;
