import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Banner from "../models/bannerModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

const exportData = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Export Banners
    console.log("\n📦 Exporting banners...");
    const banners = await Banner.find({}).lean();
    fs.writeFileSync(
      path.join(dataDir, "banners.json"),
      JSON.stringify(banners, null, 2)
    );
    console.log(`✅ Exported ${banners.length} banners`);

    // Export Brands
    console.log("\n📦 Exporting brands...");
    const brands = await Brand.find({}).lean();
    fs.writeFileSync(
      path.join(dataDir, "brands.json"),
      JSON.stringify(brands, null, 2)
    );
    console.log(`✅ Exported ${brands.length} brands`);

    // Export Categories
    console.log("\n📦 Exporting categories...");
    const categories = await Category.find({}).lean();
    fs.writeFileSync(
      path.join(dataDir, "categories.json"),
      JSON.stringify(categories, null, 2)
    );
    console.log(`✅ Exported ${categories.length} categories`);

    // Export Products (with empty ratings array)
    console.log("\n📦 Exporting products...");
    const products = await Product.find({}).lean();

    // Clear ratings array for each product
    const productsForExport = products.map((product) => ({
      ...product,
      ratings: [], // Empty ratings array
      averageRating: 0, // Reset average rating
    }));

    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(productsForExport, null, 2)
    );
    console.log(
      `✅ Exported ${productsForExport.length} products (with empty ratings)`
    );

    // Create a summary file
    const summary = {
      exportedAt: new Date().toISOString(),
      collections: {
        banners: banners.length,
        brands: brands.length,
        categories: categories.length,
        products: productsForExport.length,
      },
      note: "Products exported with empty ratings and reviews arrays",
    };

    fs.writeFileSync(
      path.join(dataDir, "export-summary.json"),
      JSON.stringify(summary, null, 2)
    );

    console.log("\n✅ Export completed successfully!");
    console.log(`📁 Data exported to: ${dataDir}`);
    console.log("\n📊 Summary:");
    console.log(`   - Banners: ${banners.length}`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${productsForExport.length}`);
    console.log("\n⚠️  Note: Original database data remains unchanged");

    process.exit(0);
  } catch (error) {
    console.error("❌ Export failed:", error.message);
    process.exit(1);
  }
};

exportData();
