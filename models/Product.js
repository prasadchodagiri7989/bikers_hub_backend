const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    manufacturer: { type: String }, // ✅ NEW FIELD
    brand: { type: String },
    model: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    stock: { type: Number, min: 0 },
    images: [{ type: String }],
    colorOptions: [{ type: String }],
    sizeOptions: [{ type: String }],
    specifications: {
      frameSize: { type: String },
      wheelSize: { type: String },
      weight: { type: String },
      gears: { type: String },
      brakeType: { type: String },
      material: { type: String }
    },
    features: [{ type: String }],
    warranty: { type: String },
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
      }
    ],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;