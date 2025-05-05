import express from "express";
import Category from "../models/category.js";
import { authenticateToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, adminOnly, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
    try {
      const categories = await Category.find({});
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching categories" });
    }
  });

export default router;
