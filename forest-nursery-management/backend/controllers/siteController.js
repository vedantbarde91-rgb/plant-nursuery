const Site = require('../models/Site');

const getSites = async (req, res) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSite = async (req, res) => {
  try {
    const site = await Site.create(req.body);
    res.status(201).json(site);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSite = async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSite = async (req, res) => {
  try {
    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: 'Site deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSites, addSite, updateSite, deleteSite };
