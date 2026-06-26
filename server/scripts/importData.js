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

const importData = async () => {
  try {
    // Get MONGO_URI from command line argument or environment variable
    const MONGO_URI = process.argv[2] || process.env.IMPORT_MONGO_URI;

    if (!MONGO_URI) {
      console.error("❌ Error: Please provide MONGO_URI");
      console.log("\n📖 Usage:");
      console.log('   npm run import-data "mongodb://your-connection-string"');
      console.log("   OR");
      console.log("   Set IMPORT_MONGO_URI in your .env file");
      process.exit(1);
    }

    console.log("🔄 Connecting to target MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to target database");

    // Check if data files exist
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      console.error("❌ Error: Data directory not found!");
      console.log("💡 Please run 'npm run export-data' first to export data");
      process.exit(1);
    }

    // Read data files
    const bannersFile = path.join(dataDir, "banners.json");
    const brandsFile = path.join(dataDir, "brands.json");
    const categoriesFile = path.join(dataDir, "categories.json");
    const productsFile = path.join(dataDir, "products.json");

    // Verify all files exist
    const requiredFiles = [
      bannersFile,
      brandsFile,
      categoriesFile,
      productsFile,
    ];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        console.error(`❌ Error: ${path.basename(file)} not found!`);
        console.log("💡 Please run 'npm run export-data' first");
        process.exit(1);
      }
    }

    // Read JSON files
    console.log("\n📖 Reading exported data files...");
    const banners = JSON.parse(fs.readFileSync(bannersFile, "utf-8"));
    const brands = JSON.parse(fs.readFileSync(brandsFile, "utf-8"));
    const categories = JSON.parse(fs.readFileSync(categoriesFile, "utf-8"));
    const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));

    console.log(`   - Banners: ${banners.length} items`);
    console.log(`   - Brands: ${brands.length} items`);
    console.log(`   - Categories: ${categories.length} items`);
    console.log(`   - Products: ${products.length} items`);

    // Import Brands first (referenced by products)
    console.log("\n📦 Importing brands...");
    const brandIdMap = {};
    for (const brand of brands) {
      const oldId = brand._id;
      delete brand._id; // Remove old ID to create new one
      delete brand.__v; // Remove version key

      const existingBrand = await Brand.findOne({ name: brand.name });
      if (existingBrand) {
        console.log(`   ⏭️  Brand "${brand.name}" already exists, skipping...`);
        brandIdMap[oldId] = existingBrand._id;
      } else {
        const newBrand = await Brand.create(brand);
        brandIdMap[oldId] = newBrand._id;
        console.log(`   ✅ Imported brand: ${brand.name}`);
      }
    }

    // Import Categories (referenced by products)
    console.log("\n📦 Importing categories...");
    const categoryIdMap = {};
    for (const category of categories) {
      const oldId = category._id;
      delete category._id;
      delete category.__v;

      const existingCategory = await Category.findOne({ name: category.name });
      if (existingCategory) {
        console.log(
          `   ⏭️  Category "${category.name}" already exists, skipping...`
        );
        categoryIdMap[oldId] = existingCategory._id;
      } else {
        const newCategory = await Category.create(category);
        categoryIdMap[oldId] = newCategory._id;
        console.log(`   ✅ Imported category: ${category.name}`);
      }
    }

    // Import Banners
    console.log("\n📦 Importing banners...");
    let bannersImported = 0;
    let bannersSkipped = 0;

    for (const banner of banners) {
      delete banner._id;
      delete banner.__v;

      const existingBanner = await Banner.findOne({ name: banner.name });
      if (existingBanner) {
        console.log(
          `   ⏭️  Banner "${banner.name}" already exists, skipping...`
        );
        bannersSkipped++;
      } else {
        await Banner.create(banner);
        bannersImported++;
        console.log(`   ✅ Imported banner: ${banner.name}`);
      }
    }

    // Import Products
    console.log("\n📦 Importing products...");
    let productsImported = 0;
    let productsSkipped = 0;

    for (const product of products) {
      delete product._id;
      delete product.__v;

      // Map old brand and category IDs to new ones
      if (product.brand && brandIdMap[product.brand]) {
        product.brand = brandIdMap[product.brand];
      }
      if (product.category && categoryIdMap[product.category]) {
        product.category = categoryIdMap[product.category];
      }

      // Ensure ratings is an empty array
      product.ratings = [];
      product.averageRating = 0;

      const existingProduct = await Product.findOne({ name: product.name });
      if (existingProduct) {
        console.log(
          `   ⏭️  Product "${product.name}" already exists, skipping...`
        );
        productsSkipped++;
      } else {
        await Product.create(product);
        productsImported++;
        console.log(`   ✅ Imported product: ${product.name}`);
      }
    }

    console.log("\n✅ Import completed successfully!");
    console.log("\n📊 Import Summary:");
    console.log(
      `   Brands: ${
        Object.keys(brandIdMap).length -
        brands.filter((b) => Brand.findOne({ name: b.name })).length
      } imported, ${
        brands.length -
        (Object.keys(brandIdMap).length -
          brands.filter((b) => Brand.findOne({ name: b.name })).length)
      } skipped`
    );
    console.log(
      `   Categories: ${
        Object.keys(categoryIdMap).length -
        categories.filter((c) => Category.findOne({ name: c.name })).length
      } imported, ${
        categories.length -
        (Object.keys(categoryIdMap).length -
          categories.filter((c) => Category.findOne({ name: c.name })).length)
      } skipped`
    );
    console.log(
      `   Banners: ${bannersImported} imported, ${bannersSkipped} skipped`
    );
    console.log(
      `   Products: ${productsImported} imported, ${productsSkipped} skipped`
    );
    console.log("\n✅ All data imported to new database!");
    console.log("⚠️  Note: Existing items were skipped to prevent duplicates");

    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

importData();
