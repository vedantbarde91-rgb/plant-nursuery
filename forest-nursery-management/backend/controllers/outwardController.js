const Outward = require('../models/Outward');
const Plant = require('../models/Plant');

// Get all outward entries
const getOutward = async (req, res) => {
  try {
    const entries = await Outward.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add outward entry and decrease plant stock
const addOutward = async (req, res) => {
  try {
    const { plantId, plantName, quantity, siteName, transportDetails, remarks } = req.body;

    // Check stock
    const plant = await Plant.findById(plantId);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    if (plant.quantity < quantity) {
      return res.status(400).json({ message: `Not enough stock. Available: ${plant.quantity}` });
    }

    const entry = await Outward.create({ plantId, plantName, quantity, siteName, transportDetails, remarks });

    // Decrease inventory
    await Plant.findByIdAndUpdate(plantId, { $inc: { quantity: -quantity } });

    res.status(201).json({ message: 'Outward entry added, stock updated', entry });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete outward entry
const deleteOutward = async (req, res) => {
  try {
    const entry = await Outward.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    // Restore inventory
    await Plant.findByIdAndUpdate(entry.plantId, { $inc: { quantity: entry.quantity } });
    await Outward.findByIdAndDelete(req.params.id);

    res.json({ message: 'Outward entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOutward, addOutward, deleteOutward };
