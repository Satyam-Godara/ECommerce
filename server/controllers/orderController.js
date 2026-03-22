const Order = require('../models/Order');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const mongoose = require("mongoose");


/* =================================================
   🔹 Create Razorpay Order
================================================= */
exports.createOrder = async (req, res) => {
  try {
    const { total } = req.body;

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json(razorpayOrder);
  } catch (err) {
    res.status(500).json({ message: "Razorpay order creation failed" });
  }
};



/* =================================================
   🔹 Verify Payment + Create Order (Atomic)
================================================= */
exports.verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      shippingInfo,
    } = req.body;

    /* ===== Verify signature ===== */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      throw new Error("Payment verification failed");
    }

    /* ===== STOCK CHECK + DEDUCT ===== */
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) throw new Error("Product not found");

      if (product.stock < item.qty) {
        throw new Error(`${product.title} only ${product.stock} left`);
      }

      product.stock -= item.qty;
      await product.save({ session });
    }

    /* ===== CREATE ORDER ===== */
    const order = await Order.create(
      [{
        user: req.user._id,
        items,
        total,
        paymentId: razorpay_payment_id,
        shippingInfo,

        // ✅ updated fields
        status: "Pending",
        orderDate: new Date(),
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      order: order[0],
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);

    res.status(400).json({
      message: err.message || "Order failed",
    });
  }
};



/* =================================================
   🔹 My Orders (USER)
   ✅ latest first
   ✅ grouped
================================================= */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ orderDate: -1 }); // newest first

    const pending = [];
    const completed = [];

    orders.forEach(order => {
      if (["Pending", "Shipped"].includes(order.status)) {
        pending.push(order);
      } else {
        completed.push(order);
      }
    });

    res.json({
      pending,
      completed,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



/* =================================================
   🔹 Admin → all orders
================================================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ orderDate: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



/* =================================================
   🔹 Admin → update status
================================================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = status;

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
};
