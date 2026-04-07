import React, { useEffect, useState } from 'react';
import { getInward, addInward, deleteInward, getPlants } from '../services/api';
import toast from 'react-hot-toast';

const emptyForm = { plantId: '', plantName: '', quantityAdded: '', source: 'Supplier', cost: '', remarks: '' };

function Inward() {
  const [entries, setEntries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    const [e, p] = await Promise.all([getInward(), getPlants()]);
    setEntries(e.data);
    setPlants(p.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handlePlantChange = (e) => {
    const plant = plants.find(p => p._id === e.target.value);
    setForm({ ...form, plantId: plant?._id || '', plantName: plant?.name || '' });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      await addInward(form);
      toast.success('Inward entry added & stock updated!');
      setForm(emptyForm);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? Stock will be reversed.')) return;
    await deleteInward(id);
    toast.success('Entry deleted, stock reversed');
    fetchAll();
  };

  const s = {
    card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    btn: (color = '#2d6a4f') => ({
      background: color, color: '#fff', border: 'none',
      padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    }),
    label: { fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 5 },
    input: {
      width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1',
      fontSize: 14, outline: 'none', boxSizing: 'border-box',
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 },
    th: { padding: '11px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 22 }}>📥 Inward Stock Entry</h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Record plants received into nursery</p>
        </div>
        <button style={s.btn()} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Entry'}
        </button>
      </div>

      {showForm && (
        <div style={{ ...s.card, marginBottom: 20, borderLeft: '4px solid #52b788' }}>
          <h3 style={{ marginBottom: 16, color: '#1b4332' }}>New Inward Entry</h3>
          <form onSubmit={handleSubmit}>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Select Plant *</label>
                <select style={s.input} value={form.plantId} onChange={handlePlantChange} required>
                  <option value="">-- Select Plant --</option>
                  {plants.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.quantity})</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Quantity Added *</label>
                <input style={s.input} type="number" min="1" value={form.quantityAdded}
                  onChange={e => setForm({ ...form, quantityAdded: e.target.value })} required placeholder="Enter quantity" />
              </div>
              <div>
                <label style={s.label}>Source *</label>
                <select style={s.input} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  <option>Supplier</option>
                  <option>Self-grown</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Cost (₹) (Optional)</label>
                <input style={s.input} type="number" min="0" value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={s.label}>Remarks</label>
                <input style={s.input} value={form.remarks}
                  onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Optional notes" />
              </div>
            </div>
            <button type="submit" style={s.btn()}>✅ Submit Entry</button>
          </form>
        </div>
      )}

      <div style={s.card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Date', 'Plant', 'Qty Added', 'Source', 'Cost', 'Remarks', 'Action'].map(h =>
              <th key={h} style={s.th}>{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {entries.length === 0
              ? <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No entries yet</td></tr>
              : entries.map(e => (
                <tr key={e._id}>
                  <td style={s.td}>{new Date(e.date).toLocaleDateString()}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#1b4332' }}>{e.plantName}</td>
                  <td style={{ ...s.td, color: '#1a936f', fontWeight: 700 }}>+{e.quantityAdded}</td>
                  <td style={s.td}>
                    <span style={{ background: e.source === 'Supplier' ? '#e0e7ff' : '#d8f3dc', padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>
                      {e.source}
                    </span>
                  </td>
                  <td style={s.td}>₹{e.cost || 0}</td>
                  <td style={{ ...s.td, color: '#888' }}>{e.remarks || '-'}</td>
                  <td style={s.td}>
                    <button style={s.btn('#e63946')} onClick={() => handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inward;
