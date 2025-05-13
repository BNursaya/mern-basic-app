import express from "express";
import Product from "../models/products.js";
import { authenticateToken, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔍 Барлық өнімдерді алу
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// 🔍 Іздеу
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const regex = new RegExp(query, 'i');

  try {
    const products = await Product.find({ name: regex }).populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// 🔍 Жеке өнім
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
});

// ✅ Қосу
router.post("/", authenticateToken, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      category,
      image: req.file?.filename || null
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ success: false, message: "Error creating product" });
  }
});

// ✏️ Жаңарту
router.put("/:id", authenticateToken, adminOnly, upload.single("image"), async (req, res) => {
  const { name, price } = req.body;

  const updateData = {
    name,
    price: parseFloat(price),
  };
  if (req.file) updateData.image = req.file.filename;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
});

// 🗑️ Өшіру
router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

export default router;