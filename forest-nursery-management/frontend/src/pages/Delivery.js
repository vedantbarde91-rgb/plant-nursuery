import React, { useEffect, useState } from 'react';
import { getDeliveries, addDelivery, updateDelivery, deleteDelivery, getPlants, getSites, addSite } from '../services/api';
import toast from 'react-hot-toast';

function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [sites, setSites] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [plantRows, setPlantRows] = useState([{ plantId: '', plantName: '', quantity: '' }]);
  const [form, setForm] = useState({
    siteId: '', siteName: '', deliveryDate: '', driverName: '', vehicleNo: '', instructions: ''
  });
  const [siteForm, setSiteForm] = useState({ name: '', type: 'School', location: '', contactPerson: '', phone: '' });

  const fetchAll = async () => {
    const [d, p, s] = await Promise.all([getDeliveries(), getPlants(), getSites()]);
    setDeliveries(d.data); setPlants(p.data); setSites(s.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSiteChange = (e) => {
    const site = sites.find(s => s._id === e.target.value);
    setForm({ ...form, siteId: site?._id || '', siteName: site?.name || '' });
  };

  const handlePlantRowChange = (idx, field, val) => {
    const updated = [...plantRows];
    if (field === 'plantId') {
      const plant = plants.find(p => p._id === val);
      updated[idx] = { ...updated[idx], plantId: val, plantName: plant?.name || '' };
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }
    setPlantRows(updated);
  };

  const addPlantRow = () => setPlantRows([...plantRows, { plantId: '', plantName: '', quantity: '' }]);
  const removePlantRow = (idx) => setPlantRows(plantRows.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validPlants = plantRows.filter(p => p.plantId && p.quantity);
      if (!validPlants.length) return toast.error('Add at least one plant');
      await addDelivery({ ...form, plants: validPlants });
      toast.success('🚛 Delivery scheduled! Notifications sent to all staff.');
      setShowForm(false);
      setForm({ siteId: '', siteName: '', deliveryDate: '', driverName: '', vehicleNo: '', instructions: '' });
      setPlantRows([{ plantId: '', plantName: '', quantity: '' }]);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    try {
      await addSite(siteForm);
      toast.success('Site added!');
      setShowSiteForm(false);
      setSiteForm({ name: '', type: 'School', location: '', contactPerson: '', phone: '' });
      fetchAll();
    } catch (err) {
      toast.error('Error adding site');
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateDelivery(id, { status });
    toast.success(`Status updated to ${status}`);
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete delivery?')) return;
    await deleteDelivery(id);
    toast.success('Delivery deleted');
    fetchAll();
  };

  const s = {
    card: { background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    btn: (color = '#2d6a4f') => ({
      background: color, color: '#fff', border: 'none',
      padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    }),
    label: { fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 5 },
    input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d1e8d1', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 },
    th: { padding: '11px 12px', textAlign: 'left', color: '#2d6a4f', fontWeight: 700, background: '#f0f7f0' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  };

  const statusColor = { Pending: '#fff3cd', Delivered: '#d8f3dc', Cancelled: '#fde8e8' };
  const statusText = { Pending: '#856404', Delivered: '#1b4332', Cancelled: '#c0392b' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 22 }}>🚛 Delivery Management</h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Schedule deliveries & auto-notify staff</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={s.btn('#6b9080')} onClick={() => setShowSiteForm(!showSiteForm)}>+ Add Site</button>
          <button style={s.btn()} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Schedule Delivery'}
          </button>
        </div>
      </div>

      {/* Add Site Form */}
      {showSiteForm && (
        <div style={{ ...s.card, marginBottom: 20, borderLeft: '4px solid #6b9080' }}>
          <h3 style={{ marginBottom: 16, color: '#1b4332' }}>Add New Site</h3>
          <form onSubmit={handleAddSite}>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Site Name *</label>
                <input style={s.input} value={siteForm.name} onChange={e => setSiteForm({ ...siteForm, name: e.target.value })} required placeholder="e.g. City School" />
              </div>
              <div>
                <label style={s.label}>Type</label>
                <select style={s.input} value={siteForm.type} onChange={e => setSiteForm({ ...siteForm, type: e.target.value })}>
                  {['School', 'Project', 'Area', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Location *</label>
                <input style={s.input} value={siteForm.location} onChange={e => setSiteForm({ ...siteForm, location: e.target.value })} required placeholder="Address" />
              </div>
              <div>
                <label style={s.label}>Contact Person</label>
                <input style={s.input} value={siteForm.contactPerson} onChange={e => setSiteForm({ ...siteForm, contactPerson: e.target.value })} placeholder="Name" />
              </div>
            </div>
            <button type="submit" style={s.btn()}>✅ Add Site</button>
          </form>
        </div>
      )}

      {/* Delivery Form */}
      {showForm && (
        <div style={{ ...s.card, marginBottom: 20, borderLeft: '4px solid #2d6a4f' }}>
          <h3 style={{ marginBottom: 4, color: '#1b4332' }}>Schedule New Delivery</h3>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
            📣 Notifications will auto-send to Manager, Driver, Supervisor & Site Incharge
          </p>
          <form onSubmit={handleSubmit}>
            <div style={s.grid}>
              <div>
                <label style={s.label}>Site *</label>
                <select style={s.input} value={form.siteId} onChange={handleSiteChange} required>
                  <option value="">-- Select Site --</option>
                  {sites.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Delivery Date *</label>
                <input style={s.input} type="date" value={form.deliveryDate}
                  onChange={e => setForm({ ...form, deliveryDate: e.target.value })} required />
              </div>
              <div>
                <label style={s.label}>Driver Name</label>
                <input style={s.input} value={form.driverName}
                  onChange={e => setForm({ ...form, driverName: e.target.value })} placeholder="Driver name" />
              </div>
              <div>
                <label style={s.label}>Vehicle Number</label>
                <input style={s.input} value={form.vehicleNo}
                  onChange={e => setForm({ ...form, vehicleNo: e.target.value })} placeholder="MH-12-AB-1234" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={s.label}>Instructions</label>
                <input style={s.input} value={form.instructions}
                  onChange={e => setForm({ ...form, instructions: e.target.value })} placeholder="Any delivery instructions" />
              </div>
            </div>

            {/* Plant Rows */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...s.label, marginBottom: 10 }}>Plants to Deliver</label>
              {plantRows.map((row, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                  <select style={{ ...s.input, flex: 2 }} value={row.plantId}
                    onChange={e => handlePlantRowChange(idx, 'plantId', e.target.value)}>
                    <option value="">-- Select Plant --</option>
                    {plants.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.quantity})</option>)}
                  </select>
                  <input style={{ ...s.input, flex: 1 }} type="number" min="1" placeholder="Qty"
                    value={row.quantity} onChange={e => handlePlantRowChange(idx, 'quantity', e.target.value)} />
                  {plantRows.length > 1 &&
                    <button type="button" style={{ ...s.btn('#e63946'), padding: '9px 12px' }} onClick={() => removePlantRow(idx)}>✕</button>}
                </div>
              ))}
              <button type="button" style={{ ...s.btn('#6b9080'), marginTop: 4 }} onClick={addPlantRow}>+ Add Plant</button>
            </div>

            <button type="submit" style={s.btn()}>🚛 Schedule & Notify All</button>
          </form>
        </div>
      )}

      {/* Deliveries Table */}
      <div style={s.card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Delivery ID', 'Site', 'Plants', 'Date', 'Driver', 'Status', 'Actions'].map(h =>
              <th key={h} style={s.th}>{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {deliveries.length === 0
              ? <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 30 }}>No deliveries scheduled</td></tr>
              : deliveries.map(d => (
                <tr key={d._id}>
                  <td style={{ ...s.td, fontWeight: 700, color: '#1b4332' }}>{d.deliveryId}</td>
                  <td style={s.td}>{d.siteName}</td>
                  <td style={s.td}>
                    {d.plants.map((p, i) => (
                      <span key={i} style={{ display: 'block', fontSize: 12 }}>{p.plantName} ×{p.quantity}</span>
                    ))}
                  </td>
                  <td style={s.td}>{new Date(d.deliveryDate).toLocaleDateString()}</td>
                  <td style={s.td}>{d.driverName || '-'}</td>
                  <td style={s.td}>
                    <select
                      style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12, fontWeight: 600,
                        background: statusColor[d.status], color: statusText[d.status], cursor: 'pointer' }}
                      value={d.status}
                      onChange={e => handleStatusChange(d._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td style={s.td}>
                    <button style={s.btn('#e63946')} onClick={() => handleDelete(d._id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Delivery;
