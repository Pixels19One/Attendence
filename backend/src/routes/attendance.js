const express = require('express');
const AttendanceController = require('../controllers/attendanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Employee routes
router.post('/checkin', AttendanceController.checkIn);
router.post('/checkout', AttendanceController.checkOut);
router.get('/today', AttendanceController.getTodayStatus);
router.get('/history', AttendanceController.validate.getHistory, AttendanceController.getHistory);
router.get('/statistics', AttendanceController.getStatistics);
router.get('/dashboard', AttendanceController.getDashboardData);

// Admin routes
router.get('/all', requireRole(['admin']), AttendanceController.getAllAttendance);

module.exports = router;