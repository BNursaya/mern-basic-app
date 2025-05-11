import express from "express";
import Product from "../models/products.js";
import { authenticateToken, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔍 Барлық өнімдерді алу (категориямен)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// 🔍 Өнім іздеу
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const regex = new RegExp(query, 'i');

  try {
    const products = await Product.find({ name: regex }).populate("category");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching products' });
  }
});

// 🔍 Жеке өнімді алу
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Жаңа өнім қосу (image + category + formData)
router.post("/", authenticateToken, adminOnly, upload.single("image"), async (req, res) => {
    try {
      console.log("📥 Body:", req.body);
      console.log("📷 File:", req.file);
      console.log("📷 File saved at:", req.file?.path);

  
      const { name, price, category } = req.body;
  
      if (!name || !price || !category) {
        return res.status(400).json({ success: false, message: "Required fields missing" });
      }
  
      const product = new Product({
        name,
        price,
        category,
        image: req.file ? req.file.filename : null
      });
  
      await product.save();
      return res.status(201).json({ success: true, data: product });
  
    } catch (error) {
      console.error("❌ Error while saving product:", error);
      return res.status(500).json({ success: false, message: "Error while saving product" });
    }
  });
  

// ✏️ Өнімді жаңарту (name, price)
router.put("/:id", authenticateToken, adminOnly, upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
  
    const priceValue = parseFloat(price);
    if (!name || isNaN(priceValue)) {
      return res.status(400).json({ success: false, message: "Required fields missing or invalid" });
    }
  
    const updateData = {
      name,
      price: priceValue,
    };
  
    if (req.file) {
      updateData.image = req.file.filename;
    }
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error("❌ Update error:", error);
      res.status(500).json({ success: false, message: "Error while updating product" });
    }
  });
  
  

// 🗑️ Өнімді өшіру
router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

export default router;
