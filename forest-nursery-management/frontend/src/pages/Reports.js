import React, { useEffect, useState } from 'react';
import { getReport, getDashboardStats } from '../services/api';
import toast from 'react-hot-toast';

function Reports() {
  const [stats, setStats] = useState(null);
  const [report, setReport] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data));
  }, []);

  const fetchReport = async () => {
    try {
      const { data } = await getReport({ from, to });
      setReport(data);
      toast.success('Report loaded!');
    } catch (err) {
      toast.error('Error loading report');
    }
  };

  const exportExcel = (type) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const user = JSON.parse(localStorage.getItem('nurseryUser') || '{}');
    const url = `/api/reports/export/${type}/excel?${params}`;
    // Use fetch to download with token
    fetch(url, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_report.xlsx`;
        link.click();
        toast.success('Excel downloaded!');
      })
      .catch(() => toast.error('Export failed'));
  };

  const exportPDF = (type) => {
    const user = JSON.parse(localStorage.getItem('nurseryUser') || '{}');
    fetch(`/api/reports/export/${type}/pdf`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.text())
      .then(html => {
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        win.print();
        toast.success('PDF ready to print!');
      })
      .catch(() => toast.error('Export failed'));
  };

  const s = {
    card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 20 },
    btn: (color = '#2d6a4f') => ({
      background: color, color: '#fff', border: 'none',
      padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    }),
    tab: (active) => ({
      padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer',
      fontWeight: 600, fontSize: 13, background: active ? '#2d6a4f' : '#f0f4f0', color: active ? '#fff' : '#666',
    }),
    th: { padding: '10px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' },
    td: { padding: '9px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 13 },
    statItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 22 }}>📊 Reports & Analytics</h2>
        <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Generate and export detailed reports</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['summary', '📈 Summary'], ['inventory', '🌿 Inventory'], ['inward', '📥 Inward'], ['outward', '📤 Outward'], ['funding', '💰 Funding']].map(([key, label]) => (
          <button key={key} style={s.tab(activeTab === key)} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {/* Date Filter */}
      <div style={{ ...s.card, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>From Date</label>
          <input type="date" style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1', fontSize: 13, outline: 'none' }}
            value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>To Date</label>
          <input type="date" style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1', fontSize: 13, outline: 'none' }}
            value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button style={{ ...s.btn(), alignSelf: 'flex-end' }} onClick={fetchReport}>🔍 Generate Report</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
          <button style={s.btn('#1a936f')} onClick={() => exportExcel(activeTab === 'inward' ? 'inward' : activeTab === 'outward' ? 'outward' : 'inventory')}>
            📥 Excel
          </button>
          <button style={s.btn('#e76f51')} onClick={() => exportPDF('inventory')}>
            🖨️ PDF
          </button>
        </div>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && stats && (
        <div style={s.card}>
          <h3 style={{ marginBottom: 16, color: '#1b4332', fontWeight: 700 }}>📈 Overall Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Total Plants in Stock', stats.totalPlants],
              ['Total Species', stats.totalSpecies],
              ['Total Deliveries', stats.totalDeliveries],
              ['Pending Deliveries', stats.pendingDeliveries],
              ['Total Sites', stats.totalSites],
            ].map(([label, val]) => (
              <div key={label} style={s.statItem}>
                <span style={{ fontSize: 14, color: '#555' }}>{label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#1b4332' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inward / Outward / Funding */}
      {report && (
        <>
          {activeTab === 'inward' && (
            <div style={s.card}>
              <h3 style={{ marginBottom: 16, color: '#1b4332', fontWeight: 700 }}>📥 Inward Report</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Date', 'Plant', 'Qty', 'Source', 'Cost'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {report.inwardData.map(e => (
                    <tr key={e._id}>
                      <td style={s.td}>{new Date(e.date).toLocaleDateString()}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{e.plantName}</td>
                      <td style={{ ...s.td, color: '#1a936f', fontWeight: 700 }}>+{e.quantityAdded}</td>
                      <td style={s.td}>{e.source}</td>
                      <td style={s.td}>₹{e.cost || 0}</td>
                    </tr>
                  ))}
                  {report.inwardData.length === 0 && <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#aaa' }}>No data for selected range</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'outward' && (
            <div style={s.card}>
              <h3 style={{ marginBottom: 16, color: '#1b4332', fontWeight: 700 }}>📤 Outward Report</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Date', 'Plant', 'Qty', 'Site', 'Transport'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {report.outwardData.map(e => (
                    <tr key={e._id}>
                      <td style={s.td}>{new Date(e.date).toLocaleDateString()}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{e.plantName}</td>
                      <td style={{ ...s.td, color: '#e63946', fontWeight: 700 }}>-{e.quantity}</td>
                      <td style={s.td}>{e.siteName}</td>
                      <td style={s.td}>{e.transportDetails || '-'}</td>
                    </tr>
                  ))}
                  {report.outwardData.length === 0 && <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#aaa' }}>No data for selected range</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'funding' && (
            <div style={s.card}>
              <h3 style={{ marginBottom: 16, color: '#1b4332', fontWeight: 700 }}>💰 Funding Report</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Plant', 'Category', 'Stock', 'Cost/Unit', 'Total Value'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {report.fundingData.map((f, i) => (
                    <tr key={i}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{f.name}</td>
                      <td style={s.td}>{f.category}</td>
                      <td style={s.td}>{f.quantity}</td>
                      <td style={s.td}>₹{f.costPerUnit}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#1a936f' }}>₹{f.totalValue}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f0f7f0', fontWeight: 700 }}>
                    <td style={s.td} colSpan={4}>Total Inventory Value</td>
                    <td style={{ ...s.td, color: '#1b4332', fontSize: 16 }}>
                      ₹{report.fundingData.reduce((sum, f) => sum + f.totalValue, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!report && activeTab !== 'summary' && (
        <div style={{ ...s.card, textAlign: 'center', color: '#aaa', padding: 40 }}>
          Select a date range and click "Generate Report" to view data.
        </div>
      )}
    </div>
  );
}

export default Reports;
