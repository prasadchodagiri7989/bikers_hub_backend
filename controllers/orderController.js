const Order = require('../models/Order');

// ✅ Place a New Order
exports.placeOrder = async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  
      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ error: 'No order items provided' });
      }
  
      console.log('Received Order Data:', req.body); // ✅ Log received data
      console.log('User ID:', req.user?.id); // ✅ Check if user is attached
  
      const order = new Order({
        user: req.user.id, // Authenticated user ID
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Order Placement Error:', error); // ✅ Log the error
      res.status(500).json({ error: 'Server error while placing order', details: error.message });
    }
  };
  

// ✅ Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user orders' });
  }
};

// ✅ Get All Orders (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all orders' });
  }
};

// ✅ Update Order Delivery Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order status' });
  }
};
