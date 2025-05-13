import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db/conn.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from 'path';
import { fileURLToPath } from 'url';

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://code.jquery.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:5001"],
        mediaSrc: ["'self'", "http://localhost:5001"],
        objectSrc: ["'none'"]
      },
    },
  })
);

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
});

app.use(globalLimiter);
app.use("/products", strictLimiter, productRoutes);
app.use("/", userRoutes);
app.use("/categories", categoryRoutes);

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Сурет маршруты
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// React frontend
app.use(express.static(path.join(__dirname, '../frontend-materialui/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-materialui/build/index.html'));
});

// Серверді тыңдату
app.listen(5001, () => {
  console.log("✅ Server started on port 5001");
});