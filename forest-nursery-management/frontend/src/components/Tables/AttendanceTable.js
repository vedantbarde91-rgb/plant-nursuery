import React from 'react';

function AttendanceTable({ records, onDelete }) {
  const th = { padding: '10px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' };
  const td = { padding: '9px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 13 };
  const statusColor = { Present: '#d8f3dc', Absent: '#fde8e8', Leave: '#fff3cd' };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{['Employee', 'Role', 'Date', 'Status', 'Check-In', 'Check-Out', 'Action'].map(h =>
          <th key={h} style={th}>{h}</th>
        )}</tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r._id}>
            <td style={{ ...td, fontWeight: 600 }}>{r.employeeName}</td>
            <td style={td}>{r.role}</td>
            <td style={td}>{new Date(r.date).toLocaleDateString()}</td>
            <td style={td}>
              <span style={{ background: statusColor[r.status] || '#eee', padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                {r.status}
              </span>
            </td>
            <td style={td}>{r.checkIn || '-'}</td>
            <td style={td}>{r.checkOut || '-'}</td>
            <td style={td}>
              {onDelete && (
                <button onClick={() => onDelete(r._id)}
                  style={{ background: '#e63946', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
        {records.length === 0 && (
          <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#aaa', padding: 24 }}>No records found</td></tr>
        )}
      </tbody>
    </table>
  );
}

export default AttendanceTable;
