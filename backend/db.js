import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'buddyscript',
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(500),
      visibility ENUM('public', 'private') DEFAULT 'public',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_posts_created (created_at),
      INDEX idx_posts_user (user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id VARCHAR(36) PRIMARY KEY,
      post_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      parent_id VARCHAR(36),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_comments_post (post_id),
      INDEX idx_comments_parent (parent_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      post_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (post_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comment_likes (
      comment_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (comment_id, user_id)
    )
  `);
}

export async function initDb() {
  const maxTries = 30;

  for (let i = 1; i <= maxTries; i++) {
    try {
      await createTables();
      console.log('Connected to MySQL');
      return;
    } catch (err) {
      console.log(`Waiting for MySQL... try ${i}/${maxTries}`);
      if (i === maxTries) {
        console.error('\nCould not connect to MySQL.');
        console.error('Make sure mysql is running and check backend/SETUP.md\n');
        throw err;
      }
      await wait(3000);
    }
  }
}

export default pool;
