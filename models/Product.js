const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Helmets', 'Gloves', 'Lights', 'Tires', 'Locks', 'Tools'] },
    brand: { type: String },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    ratings: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String }
      }
    ],
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product; // ✅ Ensure the model is exported correctly
