const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  deliveryId: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
  recipients: [{ name: String, role: String }],
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['Delivery', 'Alert', 'General'], default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
