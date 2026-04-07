import React from 'react';

// Reusable inventory table component
function InventoryTable({ plants, onDelete }) {
  const th = { padding: '11px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' };
  const td = { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 14 };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Name', 'Species', 'Category', 'Qty', 'Location', 'Action'].map(h => (
            <th key={h} style={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {plants.map(p => (
          <tr key={p._id}>
            <td style={{ ...td, fontWeight: 600 }}>{p.name}</td>
            <td style={{ ...td, fontStyle: 'italic', color: '#666' }}>{p.species}</td>
            <td style={td}>{p.category}</td>
            <td style={{ ...td, fontWeight: 700, color: p.quantity === 0 ? '#e63946' : '#1a936f' }}>{p.quantity}</td>
            <td style={td}>{p.nurseryLocation}</td>
            <td style={td}>
              {onDelete && (
                <button onClick={() => onDelete(p._id)}
                  style={{ background: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
        {plants.length === 0 && (
          <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#aaa', padding: 30 }}>No plants found</td></tr>
        )}
      </tbody>
    </table>
  );
}

export default InventoryTable;
