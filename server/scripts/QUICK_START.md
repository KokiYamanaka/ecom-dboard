# Quick Start Guide - Database Migration

## 🚀 Quick Command Reference

### Export from Current Database

```bash
cd server
npm run export-data
```

### Import to New Database

```bash
npm run import-data "YOUR_NEW_MONGO_URI"
```

---

## 📋 Step-by-Step Process

### 1️⃣ Prepare for Export

Ensure your `.env` file has the source database URI:

```env
MONGO_URI="mongodb+srv://reactbd:reactbd@cluster0.ipwol9r.mongodb.net/techbeats?retryWrites=true&w=majority&appName=Cluster0"
```

### 2️⃣ Run Export

```bash
npm run export-data
```

**Expected Output:**

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Exporting banners...
✅ Exported X banners

📦 Exporting brands...
✅ Exported X brands

📦 Exporting categories...
✅ Exported X categories

📦 Exporting products...
✅ Exported X products (with empty ratings)

✅ Export completed successfully!
```

### 3️⃣ Run Import to New Database

Replace `YOUR_NEW_URI` with your actual new database connection string:

```bash
npm run import-data "mongodb+srv://username:password@newcluster.mongodb.net/newdatabase"
```

**Expected Output:**

```
🔄 Connecting to target MongoDB...
✅ Connected to target database

📖 Reading exported data files...

📦 Importing brands...
✅ Imported brand: Brand Name

📦 Importing categories...
✅ Imported category: Category Name

📦 Importing banners...
✅ Imported banner: Banner Name

📦 Importing products...
✅ Imported product: Product Name

✅ Import completed successfully!
```

---

## ✅ What's Included in Export

| Collection     | Details                                     |
| -------------- | ------------------------------------------- |
| **Banners**    | All banner configurations                   |
| **Brands**     | All brand information                       |
| **Categories** | All category data                           |
| **Products**   | All products with **empty ratings/reviews** |

---

## 🛡️ Safety Features

- ✅ **Non-destructive export** - Source database is never modified
- ✅ **Duplicate prevention** - Import skips existing items
- ✅ **Clean ratings** - Products imported with empty ratings
- ✅ **Reference integrity** - Brand/category references automatically mapped

---

## 📁 Where is Data Stored?

After export, check:

```
server/
└── data/
    ├── banners.json
    ├── brands.json
    ├── categories.json
    ├── products.json
    └── export-summary.json
```

---

## ❓ Common Issues

| Issue                      | Solution                                          |
| -------------------------- | ------------------------------------------------- |
| "MONGO_URI not defined"    | Add MONGO_URI to `.env` file                      |
| "Data directory not found" | Run `npm run export-data` first                   |
| "Connection failed"        | Check your MongoDB URI and network                |
| Items showing "skipped"    | Items already exist in target DB (this is normal) |

---

## 💡 Pro Tips

1. **Test on a small database first** to verify the process
2. **Keep your exported data** - the `data/` folder can be backed up
3. **Check the summary** - `export-summary.json` shows what was exported
4. **Use environment variable** for production imports (more secure)

---

## 🔄 Complete Example Workflow

```bash
# Navigate to server directory
cd server

# Step 1: Export from current database
npm run export-data

# Step 2: Verify exported data
ls -la data/

# Step 3: Import to new database
npm run import-data "mongodb+srv://newuser:newpass@newcluster.mongodb.net/newdb"

# Done! 🎉
```

---

## 📞 Need Help?

Check the detailed [README.md](./README.md) for more information and troubleshooting.
