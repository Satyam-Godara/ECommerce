  const express = require('express');
  const router = express.Router();

  const protect = require('../middlewares/authMiddleware');
  const admin = require('../middlewares/adminMiddleware');
  const { uploadImage } = require('../controllers/productController');


  const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    checkStock,
  } = require('../controllers/productController');

  const upload = require('../middlewares/upload');

  router.post('/upload', protect, admin, upload.single('image'), uploadImage);

  // Public
  router.get('/', getProducts);
  router.post('/check-stock', protect, checkStock);
  router.get('/:id', getProductById);

  // Admin only
  router.post('/', protect, admin, createProduct);
  router.put('/:id', protect, admin, updateProduct);
  router.delete('/:id', protect, admin, deleteProduct);



  module.exports = router;
