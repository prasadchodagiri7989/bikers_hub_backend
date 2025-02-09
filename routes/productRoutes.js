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

module.exports = router;
