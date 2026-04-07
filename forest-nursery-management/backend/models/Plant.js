const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  species: { type: String, required: true },
  category: {
    type: String,
    enum: ['Tree', 'Shrub', 'Flower', 'Medicinal'],
    required: true
  },
  quantity: { type: Number, default: 0, min: 0 },
  nurseryLocation: { type: String, default: 'Main Nursery' },
  dateAdded: { type: Date, default: Date.now },
  costPerUnit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);
