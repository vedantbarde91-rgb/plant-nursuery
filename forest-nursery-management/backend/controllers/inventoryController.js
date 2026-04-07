const Plant = require('../models/Plant');

// Get all plants
const getPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new plant
const addPlant = async (req, res) => {
  try {
    const { name, species, category, quantity, nurseryLocation, costPerUnit } = req.body;
    const plant = await Plant.create({ name, species, category, quantity, nurseryLocation, costPerUnit });
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update plant
const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete plant
const deletePlant = async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPlants, addPlant, updatePlant, deletePlant };
