const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: { type: String },
  brand: { type: String },
  type: { type: String },
  genre: { type: String },

  price: { type: Number },
  discount: { type: Number },
  salesPrice: { type: Number },

  colors: { type: Array },
  images: { type: Array },
});

module.exports = mongoose.model("Product", productSchema);
