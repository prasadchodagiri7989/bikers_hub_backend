const express = require('express');
const Product = require('../models/Product');
const { getProductsByCategory, getProductsByCollection } = require("../controllers/productController");
const router = express.Router();

router.get("/collections/:id", getProductsByCollection);
router.get("/categories/:id", getProductsByCategory);

router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(4);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching new arrivals' });
  }
});

router.get("/collections/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log(categoryName);
    
    const validCategories = ['Helmets', 'Gloves', 'Lights', 'Tires', 'Locks', 'Tools'];
    if (!validCategories.includes(categoryName)) {
      return res.status(400).json({ message: "Invalid category" });
    } 

    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/best-sellers', async (req, res) => {
    try {
      const bestSellers = await Product.find().sort({ sold: -1 }).limit(4);
      res.json(bestSellers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching best sellers' });
    }
  });

  router.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.json(product);
    } catch (error) {
      return res.status(400).json({ message: "Invalid product ID", error });
    }
  });

module.exports = router;
