const Product = require('../models/Product');


// upload image
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload_stream(
    { folder: "sattva-products" },
    (error, result) => {
      if (error) return res.status(500).json(error);
      res.json({ url: result.secure_url });
    }
  ).end(req.file.buffer);
};


// 🔹 Create product (Admin)
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};


// 🔹 Get all products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};


// 🔹 Get single product
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};


// 🔹 Update product
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
};


// 🔹 Delete product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
// =============================
// 🔹 Check Stock Before Checkout
// =============================
exports.checkStock = async (req, res) => {
  try {
    const { items } = req.body;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.qty)
        return res.status(400).json({
          message: `${product.title} only has ${product.stock} left`
        });
    }

    // ✅ success
    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ message: "Stock check failed" });
  }
};
