const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🔵 products inside order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    paymentId: String,

    // ✅ shipping info
    shippingInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // ✅ simplified professional status
    status: {
      type: String,
      enum: ["Pending","Booked", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ✅ explicit order time (easy for frontend)
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // still keeps createdAt & updatedAt
  }
);

// ✅ ALWAYS newest orders first automatically
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);
