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

app.use(express.json()); // important

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// const authLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
//   max: 50,
// });

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

app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // немесе тек 3000 портты
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // 👈 әсіресе осыны қос!
  next();
}, express.static(path.join(__dirname, 'uploads')));


app.use(express.static(path.join(__dirname, '../frontend-materialui/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-materialui/build/index.html'));
});

//app.use(express.static(path.join(__dirname, '../frontend-jquery')));

// 404 handling middleware
// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, '../frontend-jquery/404.html'));
// });


app.listen(5001, () => {

  console.log("Server started on port 5001");
});
