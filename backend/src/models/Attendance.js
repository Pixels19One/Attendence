const { pool } = require('../config/database');

class Attendance {
  static async checkIn(userId) {
    const conn = await pool.getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      // Check if already checked in today
      const existing = await conn.query(
        'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
        [userId, today]
      );
      
      if (existing.length > 0 && existing[0].check_in) {
        throw new Error('Already checked in today');
      }
      
      if (existing.length > 0) {
        // Update existing record
        await conn.query(
          'UPDATE attendance SET check_in = ?, status = ? WHERE user_id = ? AND date = ?',
          [now, 'present', userId, today]
        );
      } else {
        // Create new record
        await conn.query(
          'INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, ?)',
          [userId, today, now, 'present']
        );
      }
      
      return await this.findByUserAndDate(userId, today);
    } finally {
      conn.release();
    }
  }
  
  static async checkOut(userId) {
    const conn = await pool.getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      const existing = await conn.query(
        'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
        [userId, today]
      );
      
      if (existing.length === 0 || !existing[0].check_in) {
        throw new Error('Must check in first');
      }
      
      if (existing[0].check_out) {
        throw new Error('Already checked out today');
      }
      
      await conn.query(
        'UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?',
        [now, userId, today]
      );
      
      return await this.findByUserAndDate(userId, today);
    } finally {
      conn.release();
    }
  }
  
  static async findByUserAndDate(userId, date) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT a.*, u.name as user_name 
         FROM attendance a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.user_id = ? AND a.date = ?`,
        [userId, date]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      conn.release();
    }
  }
  
  static async findByUser(userId, limit = 30, offset = 0) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT a.*, u.name as user_name 
         FROM attendance a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.user_id = ? 
         ORDER BY a.date DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return rows;
    } finally {
      conn.release();
    }
  }
  
  static async findAll(limit = 50, offset = 0, userId = null) {
    const conn = await pool.getConnection();
    try {
      let query = `
        SELECT a.*, u.name as user_name, u.email as user_email
        FROM attendance a 
        JOIN users u ON a.user_id = u.id
      `;
      let params = [];
      
      if (userId) {
        query += ' WHERE a.user_id = ?';
        params.push(userId);
      }
      
      query += ' ORDER BY a.date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const rows = await conn.query(query, params);
      return rows;
    } finally {
      conn.release();
    }
  }
  
  static async getStatistics(userId = null, startDate = null, endDate = null) {
    const conn = await pool.getConnection();
    try {
      let query = `
        SELECT 
          COUNT(*) as total_days,
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
          SUM(CASE WHEN status = 'partial' THEN 1 ELSE 0 END) as partial_days
        FROM attendance a
      `;
      let params = [];
      let conditions = [];
      
      if (userId) {
        conditions.push('a.user_id = ?');
        params.push(userId);
      }
      
      if (startDate) {
        conditions.push('a.date >= ?');
        params.push(startDate);
      }
      
      if (endDate) {
        conditions.push('a.date <= ?');
        params.push(endDate);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const rows = await conn.query(query, params);
      return rows[0];
    } finally {
      conn.release();
    }
  }
  
  static async getTodayStatus(userId) {
    const today = new Date().toISOString().split('T')[0];
    return await this.findByUserAndDate(userId, today);
  }
}

module.exports = Attendance;