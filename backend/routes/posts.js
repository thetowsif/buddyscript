import express from 'express';
import multer from 'multer';
import path from 'path';

import { randomUUID } from 'crypto';
import pool from '../db.js';

import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  // file size limit is 5 mb
  limits: { fileSize: 5 * 1024 * 1024 },
});

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' minute ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hour ago';
  return Math.floor(seconds / 86400) + ' day ago';
}

// get likers for a post or comment
async function getLikers(table, idCol, id) {
  const [rows] = await pool.query(
    `SELECT u.first_name, u.last_name
     FROM ${table} l
     JOIN users u ON u.id = l.user_id
     WHERE l.${idCol} = ?
     ORDER BY l.created_at DESC
     LIMIT 10`,
    [id]
  );
  return rows.map(r => ({ firstName: r.first_name, lastName: r.last_name }));
}

async function getCommentsForPost(postId, userId) {
  const [rows] = await pool.query(
    `SELECT c.*, u.first_name, u.last_name
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [postId]
  );

  const topLevel = rows.filter(c => !c.parent_id);
  
  const replies = rows.filter(c => c.parent_id);

  const buildComment = async (c) => {
    const [likeRows] = await pool.query(
      'SELECT user_id FROM comment_likes WHERE comment_id = ?',
      [c.id]
    );
    const likers = await getLikers('comment_likes', 'comment_id', c.id);

    return {
      id: c.id,
      content: c.content,
      createdAt: c.created_at,
      timeAgo: timeAgo(c.created_at),
      author: { firstName: c.first_name, lastName: c.last_name },
      likeCount: likeRows.length,
      likedByMe: likeRows.some(l => l.user_id === userId),
      likers,
      replies: [],
    };
  };

  const comments = [];
  for (const c of topLevel) {
    const comment = await buildComment(c);
    const childReplies = replies.filter(r => r.parent_id === c.id);
    for (const r of childReplies) {
      comment.replies.push(await buildComment(r));
    }
    comments.push(comment);
  }

  return comments;
}

router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ imageUrl: '/uploads/' + req.file.filename });
});

router.get('/posts', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      `SELECT p.*, u.first_name, u.last_name
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.visibility = 'public' OR p.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    const result = [];

    for (const p of posts) {
      const [likeRows] = await pool.query(
        'SELECT user_id FROM post_likes WHERE post_id = ?',
        [p.id]
      );
      const [commentCountRows] = await pool.query(
        'SELECT COUNT(*) as cnt FROM comments WHERE post_id = ?',
        [p.id]
      );
      const likers = await getLikers('post_likes', 'post_id', p.id);
      const comments = await getCommentsForPost(p.id, req.user.id);

      result.push({
        id: p.id,
        content: p.content,
        imageUrl: p.image_url,
        visibility: p.visibility,
        createdAt: p.created_at,
        timeAgo: timeAgo(p.created_at),
        author: {
          id: p.user_id,
          firstName: p.first_name,
          lastName: p.last_name,
        },
        likeCount: likeRows.length,
        likedByMe: likeRows.some(l => l.user_id === req.user.id),
        likers,
        commentCount: commentCountRows[0].cnt,
        comments,
      });
    }

    res.json({ posts: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/posts', requireAuth, async (req, res) => {
  try {
    const { content, visibility, imageUrl } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const vis = visibility === 'private' ? 'private' : 'public';
    const postId = randomUUID();

    await pool.query(
      `INSERT INTO posts (id, user_id, content, image_url, visibility)
       VALUES (?, ?, ?, ?, ?)`,
      [postId, req.user.id, content.trim(), imageUrl || null, vis]
    );

    res.status(201).json({ id: postId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/posts/:id/like', requireAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    const [existing] = await pool.query(
      'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, req.user.id]
    );

    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, req.user.id]
      );
      return res.json({ liked: false });
    }

    await pool.query(
      'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
      [postId, req.user.id]
    );

    res.json({ liked: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const commentId = randomUUID();

    await pool.query(
      `INSERT INTO comments (id, post_id, user_id, parent_id, content)
       VALUES (?, ?, ?, ?, ?)`,
      [commentId, postId, req.user.id, parentId || null, content.trim()]
    );

    res.status(201).json({ id: commentId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/comments/:id/like', requireAuth, async (req, res) => {
  try {
    const commentId = req.params.id;

    const [existing] = await pool.query(
      'SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?',
      [commentId, req.user.id]
    );

    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [commentId, req.user.id]
      );
      return res.json({ liked: false });
    }

    await pool.query(
      'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
      [commentId, req.user.id]
    );

    res.json({ liked: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
