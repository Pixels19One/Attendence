const { query, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');

class AttendanceController {
  static validate = {
    getHistory: [
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
      query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive number'),
      query('startDate').optional().isDate().withMessage('Start date must be a valid date'),
      query('endDate').optional().isDate().withMessage('End date must be a valid date')
    ]
  };
  
  static async checkIn(req, res) {
    try {
      const attendance = await Attendance.checkIn(req.user.id);
      
      res.json({
        message: 'Checked in successfully',
        attendance
      });
    } catch (error) {
      console.error('Check-in error:', error);
      if (error.message === 'Already checked in today') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async checkOut(req, res) {
    try {
      const attendance = await Attendance.checkOut(req.user.id);
      
      res.json({
        message: 'Checked out successfully',
        attendance
      });
    } catch (error) {
      console.error('Check-out error:', error);
      if (error.message === 'Must check in first' || error.message === 'Already checked out today') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getTodayStatus(req, res) {
    try {
      const attendance = await Attendance.getTodayStatus(req.user.id);
      
      res.json({
        attendance: attendance || null,
        canCheckIn: !attendance || !attendance.check_in,
        canCheckOut: attendance && attendance.check_in && !attendance.check_out
      });
    } catch (error) {
      console.error('Get today status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getHistory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { limit = 30, offset = 0 } = req.query;
      const userId = req.user.role === 'admin' ? req.query.userId : req.user.id;
      
      const attendance = await Attendance.findByUser(userId, parseInt(limit), parseInt(offset));
      
      res.json({
        attendance,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: attendance.length === parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getAllAttendance(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { limit = 50, offset = 0, userId } = req.query;
      
      const attendance = await Attendance.findAll(
        parseInt(limit),
        parseInt(offset),
        userId ? parseInt(userId) : null
      );
      
      res.json({
        attendance,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: attendance.length === parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get all attendance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.role === 'admin' ? req.query.userId : req.user.id;
      
      const stats = await Attendance.getStatistics(userId, startDate, endDate);
      
      // Calculate attendance percentage
      const attendancePercentage = stats.total_days > 0 
        ? ((stats.present_days + stats.partial_days) / stats.total_days * 100).toFixed(2)
        : 0;
      
      res.json({
        statistics: {
          ...stats,
          attendance_percentage: parseFloat(attendancePercentage)
        }
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getDashboardData(req, res) {
    try {
      const userId = req.user.id;
      
      // Get today's status
      const todayStatus = await Attendance.getTodayStatus(userId);
      
      // Get this month's statistics
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split('T')[0];
      
      const monthlyStats = await Attendance.getStatistics(userId, startDate);
      
      // Get recent attendance (last 7 days)
      const recentAttendance = await Attendance.findByUser(userId, 7, 0);
      
      res.json({
        todayStatus: {
          attendance: todayStatus || null,
          canCheckIn: !todayStatus || !todayStatus.check_in,
          canCheckOut: todayStatus && todayStatus.check_in && !todayStatus.check_out
        },
        monthlyStats: {
          ...monthlyStats,
          attendance_percentage: monthlyStats.total_days > 0 
            ? ((monthlyStats.present_days + monthlyStats.partial_days) / monthlyStats.total_days * 100).toFixed(2)
            : 0
        },
        recentAttendance
      });
    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AttendanceController;