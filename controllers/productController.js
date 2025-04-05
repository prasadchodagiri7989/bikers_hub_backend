const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params; // Collection ID from URL
    let { page, limit } = req.query; // Query params for pagination

    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 10; // Default 10 products per page
    const skip = (page - 1) * limit; // Calculate skip count


    // 🔹 Count total products in this category (instead of collectionId)
    const totalProducts = await Product.countDocuments({ category: id });

    // 🔹 Fetch paginated products
    const products = await Product.find({ category: id })
      .skip(skip)
      .limit(limit);

    // 🔹 Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // ✅ Return paginated response
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.getProductsByCollection = async (req, res) => {
  try {
    const { id } = req.params; // Collection ID from URL
    let { page, limit } = req.query; // Query params for pagination

    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 10; // Default 10 products per page
    const skip = (page - 1) * limit; // Calculate skip count


    // 🔹 Count total products in this category (instead of collectionId)
    const totalProducts = await Product.countDocuments({ brand: id });

    // 🔹 Fetch paginated products
    const products = await Product.find({ brand: id })
      .skip(skip)
      .limit(limit);

    // 🔹 Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // ✅ Return paginated response
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getProductsByBike = async (req, res) => {
  try {
    const { bike, model } = req.query;

    if (!bike || !model) {
      return res.status(400).json({ message: "Bike and model are required" });
    }

    // Assuming your Product schema has bike and model fields
    const products = await Product.find({
      bike: bike.toLowerCase(),
      model: model.toLowerCase(),
    });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products by bike:", err);
    res.status(500).json({ message: "Server error" });
  }
};