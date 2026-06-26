# Database Export/Import Scripts

These scripts allow you to export data from your current MongoDB database and import it to a new database.

## Features

- ✅ Exports banners, brands, categories, and products
- ✅ Products are exported with **empty ratings arrays**
- ✅ **Non-destructive**: Original database remains unchanged during export
- ✅ **Duplicate detection**: Import skips existing items to prevent duplicates
- ✅ **Reference mapping**: Automatically updates brand and category references during import

## Exported Collections

1. **Banners** - All banner data
2. **Brands** - All brand data
3. **Categories** - All category data
4. **Products** - All products with empty ratings and reviews

## Usage

### Step 1: Export Data from Current Database

Make sure your `.env` file has the source `MONGO_URI`:

```bash
MONGO_URI="mongodb+srv://reactbd:reactbd@cluster0.ipwol9r.mongodb.net/techbeats?retryWrites=true&w=majority&appName=Cluster0"
```

Run the export script:

```bash
npm run export-data
```

This will:

- Connect to your current database (read-only operation)
- Export all data to `server/data/` directory as JSON files
- Clear ratings arrays from products
- **NOT modify or delete any data** in your current database
- Create a summary file with export details

### Step 2: Import Data to New Database

You can import the data to a new database in two ways:

#### Option A: Using Command Line Argument (Recommended)

```bash
npm run import-data "mongodb://your-new-database-uri"
```

Example:

```bash
npm run import-data "mongodb+srv://username:password@cluster.mongodb.net/newdatabase?retryWrites=true&w=majority"
```

#### Option B: Using Environment Variable

Add to your `.env` file:

```bash
IMPORT_MONGO_URI="mongodb://your-new-database-uri"
```

Then run:

```bash
npm run import-data
```

### What Happens During Import?

1. **Connects to target database** - The new database you provided
2. **Reads exported JSON files** - From `server/data/` directory
3. **Imports in correct order**:
   - Brands first (since products reference them)
   - Categories (since products reference them)
   - Banners
   - Products (with updated brand/category references)
4. **Skips duplicates** - If an item with the same name exists, it's skipped
5. **Maps references** - Automatically updates product brand/category IDs to match new database

## Directory Structure

After export, you'll have:

```
server/
├── data/
│   ├── banners.json
│   ├── brands.json
│   ├── categories.json
│   ├── products.json
│   └── export-summary.json
└── scripts/
    ├── exportData.js
    └── importData.js
```

## Important Notes

⚠️ **Safety Features:**

- Export is **read-only** - never modifies source database
- Import **skips duplicates** - won't overwrite existing data
- Products are imported with **empty ratings** arrays
- All console output shows what's happening

⚠️ **Requirements:**

- Node.js must be installed
- All dependencies must be installed (`npm install`)
- Valid MongoDB connection strings

## Troubleshooting

### "MONGO_URI is not defined"

Make sure your `.env` file exists and contains `MONGO_URI` for export.

### "Data directory not found"

Run `npm run export-data` before trying to import.

### "Already exists, skipping"

This is normal - the import script prevents duplicate entries. If you want to re-import, you need to manually delete the existing data from the target database first.

## Example Workflow

```bash
# 1. Export from current database
npm run export-data

# 2. Import to new database
npm run import-data "mongodb+srv://user:pass@newcluster.mongodb.net/newdb"

# 3. Check the console output for summary
```

## Support

If you encounter any issues, check:

1. Your MongoDB connection strings are valid
2. You have network access to both databases
3. Your user has appropriate permissions
4. The data directory exists after export
