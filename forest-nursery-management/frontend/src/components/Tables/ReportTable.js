import React from 'react';

// Reusable report table component
function ReportTable({ headers, rows }) {
  const th = { padding: '10px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' };
  const td = { padding: '9px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 13 };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={th}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} style={td}>{cell}</td>)}</tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={headers.length} style={{ ...td, textAlign: 'center', color: '#aaa', padding: 24 }}>No data available</td></tr>
        )}
      </tbody>
    </table>
  );
}

export default ReportTable;
