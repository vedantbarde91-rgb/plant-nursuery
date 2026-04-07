const mongoose = require('mongoose');

const OutwardSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  plantName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  siteName: { type: String, required: true },
  transportDetails: { type: String, default: '' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Outward', OutwardSchema);
