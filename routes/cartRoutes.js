const express = require("express");
const { addProductToCart } = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addProductToCart);

module.exports = router;
