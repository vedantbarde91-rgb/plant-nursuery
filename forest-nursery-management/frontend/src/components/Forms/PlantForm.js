// PlantForm - reusable plant form component
// Used by Inventory page. Logic is inline there; this is for standalone usage.
import React from 'react';

function PlantForm({ form, setForm, onSubmit }) {
  const input = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 };
  return (
    <form onSubmit={onSubmit}>
      <input style={input} placeholder="Plant Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input style={input} placeholder="Species" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} required />
      <select style={input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        {['Tree', 'Shrub', 'Flower', 'Medicinal'].map(c => <option key={c}>{c}</option>)}
      </select>
      <input style={input} type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
      <button type="submit" style={{ background: '#2d6a4f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
        Add Plant
      </button>
    </form>
  );
}

export default PlantForm;
