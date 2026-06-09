import jwt from 'jsonwebtoken';
import pool from '../db.js';

export async function requireAuth(req, res, next){
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Not logged in' });
    }


    
    req.user = {
      id: rows[0].id,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
    };


    // console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not logged in' });
  }
}
