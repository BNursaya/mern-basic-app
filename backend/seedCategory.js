import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/category.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Category.find({});
    if (existing.length > 0) {
      console.log("📌 Categories already exist.");
      return;
    }

    const categories = [
      { name: "Clothing" },
      { name: "Shoes" },
      { name: "Electronics" },
      { name: "Accessories" }
    ];

    await Category.insertMany(categories);
    console.log("✅ Categories seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedCategories();

