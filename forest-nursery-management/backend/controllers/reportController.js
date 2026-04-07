const Plant = require('../models/Plant');
const Inward = require('../models/Inward');
const Outward = require('../models/Outward');
const Delivery = require('../models/Delivery');
const Attendance = require('../models/Attendance');
const Site = require('../models/Site');

// Summary dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalPlants = await Plant.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]);
    const totalSpecies = await Plant.countDocuments();
    const totalDeliveries = await Delivery.countDocuments();
    const pendingDeliveries = await Delivery.countDocuments({ status: 'Pending' });
    const totalSites = await Site.countDocuments();

    const recentInward = await Inward.find().sort({ createdAt: -1 }).limit(5);
    const recentOutward = await Outward.find().sort({ createdAt: -1 }).limit(5);
    const recentDeliveries = await Delivery.find().sort({ createdAt: -1 }).limit(5);

    // Monthly inward/outward for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyInward = await Inward.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, total: { $sum: '$quantityAdded' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyOutward = await Outward.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, total: { $sum: '$quantity' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalPlants: totalPlants[0]?.total || 0,
      totalSpecies,
      totalDeliveries,
      pendingDeliveries,
      totalSites,
      recentInward,
      recentOutward,
      recentDeliveries,
      monthlyInward,
      monthlyOutward
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Full report with date filter
const getReport = async (req, res) => {
  try {
    const { from, to, type } = req.query;
    let dateFilter = {};
    if (from && to) {
      dateFilter = { createdAt: { $gte: new Date(from), $lte: new Date(to) } };
    }

    const inwardData = await Inward.find(dateFilter);
    const outwardData = await Outward.find(dateFilter);
    const deliveryData = await Delivery.find(dateFilter);
    const attendanceData = await Attendance.find(dateFilter);

    // Funding summary
    const plants = await Plant.find();
    const fundingData = plants.map(p => ({
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      costPerUnit: p.costPerUnit,
      totalValue: p.quantity * p.costPerUnit
    }));

    res.json({ inwardData, outwardData, deliveryData, attendanceData, fundingData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getReport };
