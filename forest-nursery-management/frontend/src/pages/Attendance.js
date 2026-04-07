import React, { useEffect, useState } from 'react';
import { getAttendance, markAttendance, deleteAttendance, getEmployees, addEmployee, deleteEmployee } from '../services/api';
import toast from 'react-hot-toast';

function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tab, setTab] = useState('attendance'); // 'attendance' | 'employees'
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });
  const [empForm, setEmpForm] = useState({ name: '', role: 'Worker', phone: '', email: '' });

  const fetchAll = async () => {
    const [r, e] = await Promise.all([
      getAttendance({ date: filterDate }),
      getEmployees()
    ]);
    setRecords(r.data); setEmployees(e.data);
  };

  useEffect(() => { fetchAll(); }, [filterDate]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      await markAttendance(form);
      toast.success('Attendance marked!');
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleAddEmployee = async (ev) => {
    ev.preventDefault();
    try {
      await addEmployee(empForm);
      toast.success('Employee added!');
      setEmpForm({ name: '', role: 'Worker', phone: '', email: '' });
      fetchAll();
    } catch (err) {
      toast.error('Error adding employee');
    }
  };

  const handleDeleteEmp = async (id) => {
    if (!window.confirm('Delete employee?')) return;
    await deleteEmployee(id);
    toast.success('Employee deleted');
    fetchAll();
  };

  const handleDeleteRecord = async (id) => {
    await deleteAttendance(id);
    toast.success('Record deleted');
    fetchAll();
  };

  const s = {
    card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    btn: (color = '#2d6a4f') => ({
      background: color, color: '#fff', border: 'none',
      padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    }),
    tab: (active) => ({
      padding: '9px 20px', border: 'none', borderRadius: 8, cursor: 'pointer',
      fontWeight: 600, fontSize: 14, background: active ? '#2d6a4f' : '#f0f4f0',
      color: active ? '#fff' : '#666',
    }),
    label: { fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 5 },
    input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 },
    th: { padding: '11px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  };

  const statusColor = { Present: '#d8f3dc', Absent: '#fde8e8', Leave: '#fff3cd' };
  const statusText = { Present: '#1b4332', Absent: '#c0392b', Leave: '#856404' };
  const roleColor = { Manager: '#e0e7ff', Driver: '#d8f3dc', Supervisor: '#fef9c3', Worker: '#fde8e8' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 22 }}>📋 Attendance Management</h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{employees.length} employees registered</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.tab(tab === 'attendance')} onClick={() => setTab('attendance')}>📅 Attendance</button>
          <button style={s.tab(tab === 'employees')} onClick={() => setTab('employees')}>👥 Employees</button>
        </div>
      </div>

      {/* Attendance Tab */}
      {tab === 'attendance' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <input type="date" style={{ ...s.input, width: 'auto' }} value={filterDate}
              onChange={e => setFilterDate(e.target.value)} />
            <span style={{ color: '#666', fontSize: 14 }}>{records.length} records for this date</span>
            <button style={{ ...s.btn(), marginLeft: 'auto' }} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Mark Attendance'}
            </button>
          </div>

          {showForm && (
            <div style={{ ...s.card, marginBottom: 16, borderLeft: '4px solid #2d6a4f' }}>
              <h3 style={{ marginBottom: 14, color: '#1b4332' }}>Mark Attendance</h3>
              <form onSubmit={handleSubmit}>
                <div style={s.grid}>
                  <div>
                    <label style={s.label}>Employee *</label>
                    <select style={s.input} value={form.employeeId}
                      onChange={e => setForm({ ...form, employeeId: e.target.value })} required>
                      <option value="">-- Select Employee --</option>
                      {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.role})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Date *</label>
                    <input style={s.input} type="date" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div>
                    <label style={s.label}>Status</label>
                    <select style={s.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Leave</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Check-In Time</label>
                    <input style={s.input} type="time" value={form.checkIn}
                      onChange={e => setForm({ ...form, checkIn: e.target.value })} />
                  </div>
                  <div>
                    <label style={s.label}>Check-Out Time</label>
                    <input style={s.input} type="time" value={form.checkOut}
                      onChange={e => setForm({ ...form, checkOut: e.target.value })} />
                  </div>
                </div>
                <button type="submit" style={s.btn()}>✅ Mark Attendance</button>
              </form>
            </div>
          )}

          <div style={s.card}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Employee', 'Role', 'Date', 'Status', 'Check-In', 'Check-Out', 'Action'].map(h =>
                  <th key={h} style={s.th}>{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {records.length === 0
                  ? <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No attendance records for this date</td></tr>
                  : records.map(r => (
                    <tr key={r._id}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{r.employeeName}</td>
                      <td style={s.td}>
                        <span style={{ background: roleColor[r.role] || '#eee', padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>
                          {r.role}
                        </span>
                      </td>
                      <td style={s.td}>{new Date(r.date).toLocaleDateString()}</td>
                      <td style={s.td}>
                        <span style={{ background: statusColor[r.status], color: statusText[r.status], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={s.td}>{r.checkIn || '-'}</td>
                      <td style={s.td}>{r.checkOut || '-'}</td>
                      <td style={s.td}>
                        <button style={s.btn('#e63946')} onClick={() => handleDeleteRecord(r._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Employees Tab */}
      {tab === 'employees' && (
        <>
          <div style={{ ...s.card, marginBottom: 16, borderLeft: '4px solid #52b788' }}>
            <h3 style={{ marginBottom: 14, color: '#1b4332' }}>Add Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <div style={s.grid}>
                <div>
                  <label style={s.label}>Name *</label>
                  <input style={s.input} value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} required placeholder="Full name" />
                </div>
                <div>
                  <label style={s.label}>Role *</label>
                  <select style={s.input} value={empForm.role} onChange={e => setEmpForm({ ...empForm, role: e.target.value })}>
                    {['Manager', 'Driver', 'Supervisor', 'Worker'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Phone</label>
                  <input style={s.input} value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} placeholder="Phone number" />
                </div>
                <div>
                  <label style={s.label}>Email</label>
                  <input style={s.input} value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} placeholder="Email" />
                </div>
              </div>
              <button type="submit" style={s.btn()}>+ Add Employee</button>
            </form>
          </div>

          <div style={s.card}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Role', 'Phone', 'Email', 'Action'].map(h =>
                  <th key={h} style={s.th}>{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {employees.length === 0
                  ? <tr><td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No employees yet</td></tr>
                  : employees.map(e => (
                    <tr key={e._id}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{e.name}</td>
                      <td style={s.td}>
                        <span style={{ background: roleColor[e.role] || '#eee', padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                          {e.role}
                        </span>
                      </td>
                      <td style={s.td}>{e.phone || '-'}</td>
                      <td style={s.td}>{e.email || '-'}</td>
                      <td style={s.td}>
                        <button style={s.btn('#e63946')} onClick={() => handleDeleteEmp(e._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;
