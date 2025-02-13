const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching new arrivals' });
  }
});

router.get('/best-sellers', async (req, res) => {
    try {
      const bestSellers = await Product.find().sort({ sold: -1 }).limit(6);
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
