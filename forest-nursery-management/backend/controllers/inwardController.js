const Inward = require('../models/Inward');
const Plant = require('../models/Plant');

// Get all inward entries
const getInward = async (req, res) => {
  try {
    const entries = await Inward.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add inward entry and increase plant stock
const addInward = async (req, res) => {
  try {
    const { plantId, plantName, quantityAdded, source, cost, remarks } = req.body;

    const entry = await Inward.create({ plantId, plantName, quantityAdded, source, cost, remarks });

    // Increase inventory
    await Plant.findByIdAndUpdate(plantId, { $inc: { quantity: quantityAdded } });

    res.status(201).json({ message: 'Inward entry added, stock updated', entry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete inward entry
const deleteInward = async (req, res) => {
  try {
    const entry = await Inward.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    // Decrease inventory back
    await Plant.findByIdAndUpdate(entry.plantId, { $inc: { quantity: -entry.quantityAdded } });
    await Inward.findByIdAndDelete(req.params.id);

    res.json({ message: 'Inward entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getInward, addInward, deleteInward };
