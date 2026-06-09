import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { randomUUID } from 'crypto';
import pool from '../db.js';

const router = express.Router();

const registerSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

function setTokenCookie(res, userId) {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
}

function formatUser(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, email, password } = value;

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = randomUUID();

    await pool.query(
      `INSERT INTO users (id, first_name, last_name, email, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, email, passwordHash]
    );

    const user = {
      id: userId,
      firstName,
      lastName,
      email,
    };
    setTokenCookie(res, user.id);

    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = formatUser(userRow);
    setTokenCookie(res, user.id);

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
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
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user: formatUser(rows[0]) });
  } catch (err) {
    res.status(401).json({ error: 'Not logged in' });
  }
});

export default router;
