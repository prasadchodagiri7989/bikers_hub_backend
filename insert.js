const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Product = require("./models/Product"); // Adjust path if needed
const JSON_PATH = path.join(__dirname, "products.json");

// Helper to normalize a product entry
function normalizeProduct(data) {
  const {
    id,
    price,
    discount,
    stock,
    rating,
    sold,
    isFeatured,
    images,
    ...rest
  } = data;

  const product = {
    ...rest,
    price: parseFloat(price),
    discount: parseFloat(discount || 0),
    stock: parseInt(stock),
    rating: parseFloat(rating || 0),
    sold: parseInt(sold || 0),
    isFeatured: String(isFeatured).toLowerCase() === "true",
    colorOptions: [],
    features: [],
    images: []
  };

  // Extract dynamic colorOptions__xxx and features__xxx
  for (const key in data) {
    if (key.startsWith("colorOptions__") && data[key]?.trim()) {
      product.colorOptions.push(data[key].trim());
    }

    if (key.startsWith("features__") && data[key]?.trim()) {
      product.features.push(data[key].trim());
    }
  }

  // Handle single string or comma-separated images
  if (images) {
    if (Array.isArray(images)) {
      product.images = images;
    } else {
      product.images = images.split(",").map((img) => img.trim());
    }
  }

  return product;
}

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Read and parse JSON
    const rawData = fs.readFileSync(JSON_PATH, "utf-8");
    const products = JSON.parse(rawData);

    // Normalize each product
    const cleanedProducts = products.map(normalizeProduct);

    // Insert into MongoDB
    const result = await Product.insertMany(cleanedProducts);
    console.log(`✅ Inserted ${result.length} products`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.disconnect();
  }
}

importProducts();
