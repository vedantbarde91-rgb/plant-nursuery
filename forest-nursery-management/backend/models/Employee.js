const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['Manager', 'Driver', 'Supervisor', 'Worker'],
    required: true
  },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
