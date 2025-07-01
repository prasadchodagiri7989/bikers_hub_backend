const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product"); // Adjust path if needed

// Capitalize every letter in the brand
function toAllCaps(str) {
  return str.trim().toUpperCase();
}

async function normalizeBrandNamesToUpperCase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all distinct brand names
    const distinctBrands = await Product.distinct("brand");

    let totalUpdated = 0;

    for (const oldBrand of distinctBrands) {
      const normalizedBrand = toAllCaps(oldBrand);

      // Skip if already normalized
      if (oldBrand === normalizedBrand) continue;

      const result = await Product.updateMany(
        { brand: oldBrand },
        { $set: { brand: normalizedBrand } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} products: "${oldBrand}" → "${normalizedBrand}"`);
        totalUpdated += result.modifiedCount;
      }
    }

    console.log(`🎉 Total updated products: ${totalUpdated}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

normalizeBrandNamesToUpperCase();
