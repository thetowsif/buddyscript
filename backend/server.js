import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', postRoutes);

app.get('/', (req, res) => {
  res.send('Buddyscript API');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.log('Failed to start:', err);
  process.exit(1);
});
