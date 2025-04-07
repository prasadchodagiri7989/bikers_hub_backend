const { MongoClient, ObjectId } = require("mongodb");
const csv = require("csvtojson");
const path = require("path");
require('dotenv').config();


// === CONFIG ===
const MONGO_URI = process.env.MONGO_URI // Or your Atlas URI
const DB_NAME = "test";
const COLLECTION_NAME = "products";
const CSV_PATH = path.join(__dirname, "test.products.csv"); // Adjust if needed

async function run() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Convert CSV to JSON
    const products = await csv().fromFile(CSV_PATH);

    // Add _id as ObjectId in order
    const updatedProducts = products.map((p) => ({
      _id: new ObjectId(),
      ...p,
      price: parseFloat(p.price),
      stock: parseInt(p.stock),
      sold: parseInt(p.sold),
      ratings: parseFloat(p.ratings),
      isFeatured: p.isFeatured === "true", // if from CSV string
    }));

    const result = await collection.insertMany(updatedProducts);
    console.log(`✅ Inserted ${result.insertedCount} products`);
  } catch (error) {
    console.error("❌ Error inserting products:", error);
  } finally {
    await client.close();
  }
}

run();
