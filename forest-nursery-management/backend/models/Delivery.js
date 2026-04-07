const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  deliveryId: { type: String, unique: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  siteName: { type: String, required: true },
  plants: [{
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    plantName: String,
    quantity: Number
  }],
  deliveryDate: { type: Date, required: true },
  driverName: { type: String, default: '' },
  vehicleNo: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
  instructions: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate deliveryId before saving
DeliverySchema.pre('save', async function (next) {
  if (!this.deliveryId) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.deliveryId = `DEL-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', DeliverySchema);
