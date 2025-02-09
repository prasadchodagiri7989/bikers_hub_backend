const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Place Order (Authenticated Users)
router.post('/', protect, placeOrder);

// ✅ Get User Orders (Authenticated Users)
router.get('/my-orders', protect, getUserOrders);

// ✅ Get All Orders (Admin Only)
router.get('/', protect, getAllOrders);

// ✅ Update Order Delivery Status (Admin Only)
router.put('/:id/deliver', protect, updateOrderStatus);

module.exports = router;
