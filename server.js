const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes'); // ✅ Import product routes
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
app.use(express.json()); // ✅ Middleware to parse JSON
app.use(cors()); // ✅ Enable CORS

// ✅ Use the product routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
