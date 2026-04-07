const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get all attendance records
const getAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    let filter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    if (employeeId) filter.employeeId = employeeId;

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check if already marked for the day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      employeeId,
      date: { $gte: dayStart, $lte: dayEnd }
    });

    if (existing) {
      // Update existing
      existing.status = status;
      existing.checkIn = checkIn || existing.checkIn;
      existing.checkOut = checkOut || existing.checkOut;
      await existing.save();
      return res.json({ message: 'Attendance updated', record: existing });
    }

    const record = await Attendance.create({
      employeeId,
      employeeName: employee.name,
      role: employee.role,
      date,
      status,
      checkIn,
      checkOut
    });

    res.status(201).json({ message: 'Attendance marked', record });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add employee
const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendance, markAttendance, deleteAttendance, getEmployees, addEmployee, deleteEmployee };
