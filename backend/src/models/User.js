const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const conn = await pool.getConnection();
    try {
      const { name, email, password, role = 'employee' } = userData;
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
      
      const result = await conn.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      
      return {
        id: Number(result.insertId),
        name,
        email,
        role
      };
    } finally {
      conn.release();
    }
  }
  
  static async findByEmail(email) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      conn.release();
    }
  }
  
  static async findById(id) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      conn.release();
    }
  }
  
  static async findAll() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
      return rows;
    } finally {
      conn.release();
    }
  }
  
  static async updateProfile(id, userData) {
    const conn = await pool.getConnection();
    try {
      const { name, email } = userData;
      await conn.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
      
      return await this.findById(id);
    } finally {
      conn.release();
    }
  }
  
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;