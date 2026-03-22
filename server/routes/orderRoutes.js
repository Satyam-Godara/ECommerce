const express = require('express');
const router = express.Router();
const admin = require('../middlewares/adminMiddleware');


const protect = require('../middlewares/authMiddleware');

const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');


// 🔹 User routes
router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyOrders);


// 🔹 Admin routes
router.get('/admin/all',protect, admin, getAllOrders);
router.patch('/admin/:id',protect, admin, updateOrderStatus);

module.exports = router;
