const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
    },

    image: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
      min:0,
    },
    inStock:{
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


productSchema.pre("save",function(next){
  this.inStock = this.stock > 0;
  // next();
});

module.exports = mongoose.model('Product', productSchema);
