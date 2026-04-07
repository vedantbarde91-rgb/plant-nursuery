const express = require('express');
const router = express.Router();
const {
  getAttendance, markAttendance, deleteAttendance,
  getEmployees, addEmployee, deleteEmployee
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Attendance
router.get('/', protect, getAttendance);
router.post('/', protect, markAttendance);
router.delete('/:id', protect, deleteAttendance);

// Employees
router.get('/employees', protect, getEmployees);
router.post('/employees', protect, addEmployee);
router.delete('/employees/:id', protect, deleteEmployee);

module.exports = router;
