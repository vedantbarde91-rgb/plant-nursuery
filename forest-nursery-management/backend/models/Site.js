const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['School', 'Project', 'Area', 'Other'], default: 'Other' },
  location: { type: String, required: true },
  contactPerson: { type: String, default: '' },
  phone: { type: String, default: '' },
  totalPlantsDelivered: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Site', SiteSchema);
