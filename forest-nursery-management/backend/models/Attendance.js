const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeName: { type: String, required: true },
  role: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' },
  checkIn: { type: String, default: '' },
  checkOut: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
