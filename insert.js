const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Product = require("./models/Product"); // Adjust to your actual model path

const JSON_PATH = path.join(__dirname, "products.json");

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Read JSON
    const rawData = fs.readFileSync(JSON_PATH, "utf-8");
    const products = JSON.parse(rawData);

    // Remove 'id' and prepare entries
    const cleanedProducts = products.map(({ id, ...rest }) => ({
      ...rest,
      price: parseFloat(rest.price),
      discount: parseFloat(rest.discount || 0),
      stock: parseInt(rest.stock),
      rating: parseFloat(rest.rating || 0),
      sold: parseInt(rest.sold || 0),
      isFeatured: rest.isFeatured || false,
    }));

    // Insert
    const result = await Product.insertMany(cleanedProducts);
    console.log(`✅ Inserted ${result.length} products`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

importProducts();
