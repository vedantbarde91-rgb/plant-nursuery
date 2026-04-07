const express = require('express');
const router = express.Router();
const { getDashboardStats, getReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { exportToExcel } = require('../utils/excelExport');
const { generatePDFHTML } = require('../utils/pdfExport');
const Inward = require('../models/Inward');
const Outward = require('../models/Outward');
const Plant = require('../models/Plant');

router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, getReport);

// Export inventory to Excel
router.get('/export/inventory/excel', protect, async (req, res) => {
  try {
    const plants = await Plant.find();
    const data = plants.map(p => ({
      Name: p.name, Species: p.species, Category: p.category,
      Quantity: p.quantity, Location: p.nurseryLocation, 'Cost/Unit': p.costPerUnit
    }));
    const buffer = exportToExcel(data, 'Inventory');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export inward to Excel
router.get('/export/inward/excel', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    let filter = {};
    if (from && to) filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    const entries = await Inward.find(filter);
    const data = entries.map(e => ({
      Date: new Date(e.date).toLocaleDateString(), Plant: e.plantName,
      Quantity: e.quantityAdded, Source: e.source, Cost: e.cost
    }));
    const buffer = exportToExcel(data, 'Inward');
    res.setHeader('Content-Disposition', 'attachment; filename=inward_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export outward to Excel
router.get('/export/outward/excel', protect, async (req, res) => {
  try {
    const { from, to } = req.query;
    let filter = {};
    if (from && to) filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    const entries = await Outward.find(filter);
    const data = entries.map(e => ({
      Date: new Date(e.date).toLocaleDateString(), Plant: e.plantName,
      Quantity: e.quantity, Site: e.siteName, Transport: e.transportDetails
    }));
    const buffer = exportToExcel(data, 'Outward');
    res.setHeader('Content-Disposition', 'attachment; filename=outward_report.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export inventory PDF (returns HTML for print)
router.get('/export/inventory/pdf', protect, async (req, res) => {
  try {
    const plants = await Plant.find();
    const headers = ['Name', 'Species', 'Category', 'Quantity', 'Location', 'Cost/Unit'];
    const rows = plants.map(p => [p.name, p.species, p.category, p.quantity, p.nurseryLocation, p.costPerUnit]);
    const html = generatePDFHTML('Inventory Report', headers, rows);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
