const mongoose = require('mongoose');

const InwardSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  plantName: { type: String, required: true },
  quantityAdded: { type: Number, required: true, min: 1 },
  source: { type: String, enum: ['Supplier', 'Self-grown'], required: true },
  cost: { type: Number, default: 0 },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Inward', InwardSchema);
