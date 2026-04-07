import React, { useEffect, useState } from 'react';
import { getPlants, addPlant, deletePlant } from '../services/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', species: '', category: 'Tree', quantity: '', nurseryLocation: '', costPerUnit: '' };

function Inventory() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    const { data } = await getPlants();
    setPlants(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPlant(form);
      toast.success('Plant added to inventory!');
      setForm(emptyForm);
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding plant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plant?')) return;
    await deletePlant(id);
    toast.success('Plant deleted');
    fetch();
  };

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColor = { Tree: '#d8f3dc', Shrub: '#fef9c3', Flower: '#fde8e8', Medicinal: '#e0e7ff' };

  const s = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    btn: (color = '#2d6a4f') => ({
      background: color, color: '#fff', border: 'none',
      padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
      fontWeight: 600, fontSize: 14,
    }),
    searchInput: {
      padding: '9px 14px', borderRadius: 10, border: '1.5px solid #d1e8d1',
      fontSize: 14, width: 220, outline: 'none',
    },
    card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 },
    label: { fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 5 },
    input: {
      width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1',
      fontSize: 14, outline: 'none', boxSizing: 'border-box',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
    th: { padding: '11px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f5f5f5' },
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 22 }}>🌿 Plant Inventory</h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{plants.length} plants in nursery</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input style={s.searchInput} placeholder="🔍 Search plants..." value={search} onChange={e => setSearch(e.target.value)} />
          <button style={s.btn()} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Plant'}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ ...s.card, marginBottom: 20, borderLeft: '4px solid #2d6a4f' }}>
          <h3 style={{ marginBottom: 16, color: '#1b4332' }}>Add New Plant</h3>
          <form onSubmit={handleSubmit}>
            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Plant Name *</label>
                <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Neem" />
              </div>
              <div>
                <label style={s.label}>Species *</label>
                <input style={s.input} value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} required placeholder="e.g. Azadirachta indica" />
              </div>
              <div>
                <label style={s.label}>Category *</label>
                <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Tree', 'Shrub', 'Flower', 'Medicinal'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Initial Quantity</label>
                <input style={s.input} type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label style={s.label}>Nursery Location</label>
                <input style={s.input} value={form.nurseryLocation} onChange={e => setForm({ ...form, nurseryLocation: e.target.value })} placeholder="e.g. Block A" />
              </div>
              <div>
                <label style={s.label}>Cost Per Unit (₹)</label>
                <input style={s.input} type="number" min="0" value={form.costPerUnit} onChange={e => setForm({ ...form, costPerUnit: e.target.value })} placeholder="0" />
              </div>
            </div>
            <button type="submit" style={s.btn()}>✅ Add Plant</button>
          </form>
        </div>
      )}

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>{['Plant Name', 'Species', 'Category', 'Qty', 'Location', 'Cost/Unit', 'Action'].map(h =>
              <th key={h} style={s.th}>{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No plants found</td></tr>
              : filtered.map(p => (
                <tr key={p._id}>
                  <td style={{ ...s.td, fontWeight: 600, color: '#1b4332' }}>{p.name}</td>
                  <td style={{ ...s.td, color: '#666', fontStyle: 'italic' }}>{p.species}</td>
                  <td style={s.td}>
                    <span style={{ background: categoryColor[p.category] || '#eee', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontWeight: 700, color: p.quantity === 0 ? '#e63946' : '#1a936f', fontSize: 16 }}>{p.quantity}</td>
                  <td style={s.td}>{p.nurseryLocation}</td>
                  <td style={s.td}>₹{p.costPerUnit}</td>
                  <td style={s.td}>
                    <button style={s.btn('#e63946')} onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
