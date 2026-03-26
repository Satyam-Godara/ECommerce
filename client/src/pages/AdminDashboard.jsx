
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ecommerce-jlg9.onrender.com/api/products";
const ORDER_API = "https://ecommerce-jlg9.onrender.com/api/orders";

export default function AdminDashboard() {
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // =========================
  // STATES
  // =========================
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  const emptyForm = {
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${ORDER_API}/admin/all`, { headers });
    setOrders(res.data);
  };

  // =========================
  // PRODUCT LOGIC
  // =========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = async (file) => {
    setLoadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${API}/upload`, formData, { headers });

    setLoadingImage(false);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId)
      await axios.put(`${API}/${editingId}`, form, { headers });
    else
      await axios.post(API, form, { headers });

    setForm(emptyForm);
    setEditingId(null);
    fetchProducts();
  };

  const editProduct = (p) => {
    setForm(p);
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/${id}`, { headers });
    fetchProducts();
  };

  // =========================
  // ORDER LOGIC
  // =========================
  const updateStatus = async (id, status) => {
    await axios.patch(`${ORDER_API}/admin/${id}`, { status }, { headers });
    fetchOrders();
  };

  const statuses = ["Pending", "Booked", "Shipped", "Delivered", "Cancelled"];
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-[#fdf6ee] min-h-screen px-4 sm:px-6 md:px-16 py-6 sm:py-10">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#5e3e2d] mb-8 sm:mb-10">
        🌿 Ayurveda Admin Panel
      </h1>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white/90 backdrop-blur p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl mb-10 sm:mb-12 border border-[#f2e6d9]">

        <h2 className="text-xl sm:text-2xl font-semibold text-[#5e3e2d] mb-5 sm:mb-6">
          📦 Manage Products
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border border-[#e8d8c5] p-3 rounded-xl focus:ring-2 focus:ring-[#8c5a3c]"
            required
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="border border-[#e8d8c5] p-3 rounded-xl focus:ring-2 focus:ring-[#8c5a3c]"
            required
          />

          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock"
            className="border border-[#e8d8c5] p-3 rounded-xl focus:ring-2 focus:ring-[#8c5a3c]"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border border-[#e8d8c5] p-3 rounded-xl focus:ring-2 focus:ring-[#8c5a3c]"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-[#e8d8c5] p-3 rounded-xl md:col-span-2 focus:ring-2 focus:ring-[#8c5a3c]"
          />

          <input
            type="file"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              setForm({ ...form, image: url });
            }}
            className="md:col-span-2"
          />

          {loadingImage && (
            <p className="text-sm text-gray-500 md:col-span-2">
              Uploading image...
            </p>
          )}

          <button className="bg-[#8c5a3c] hover:bg-[#6f452f] text-white py-3 rounded-full md:col-span-2 font-semibold shadow-md transition-all">
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="grid gap-4 mb-12 sm:mb-14">

        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >

            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={p.image}
                alt={p.title}
                className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-xl"
              />

              <div>
                <h3 className="font-semibold text-[#5e3e2d] text-base sm:text-lg">
                  {p.title}
                </h3>

                <p className="text-[#355e3b] font-medium text-sm sm:text-base">
                  ₹ {p.price}
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  Stock: {p.stock}
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => editProduct(p)}
                className="bg-[#355e3b] hover:bg-[#2a4a2f] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ORDERS ================= */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5e3e2d] mb-5 sm:mb-6">
        📦 Orders Management
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition
            ${
              activeTab === s
                ? "bg-[#8c5a3c] text-white"
                : "bg-white text-[#5e3e2d] border border-[#e8d8c5]"
            }`}
          >
            {s} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4 sm:gap-5">

        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-4 sm:p-6 border border-[#f2e6d9]"
          >

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-sm sm:text-base">
                  {order.user?.name}
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  {order.user?.email}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border border-[#e8d8c5] px-3 py-1 rounded-lg text-sm"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Shipping */}
            {order.shippingInfo && (
              <div className="bg-[#fdf6ee] border border-[#e8d8c5] rounded-2xl p-3 sm:p-4 mb-4 text-xs sm:text-sm space-y-2 sm:space-y-3">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 gap-1">
                  <h3 className="font-bold">
                    Order #{order._id.slice(-6)}
                  </h3>

                  <span className="text-xs text-gray-500">
                    {formatDate(order.orderDate)}
                  </span>
                </div>

                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-semibold">
                    {order.shippingInfo.name}
                  </span>
                </p>

                <p>
                  <span className="text-gray-500">Mobile:</span>{" "}
                  <span className="font-semibold text-blue-600">
                    📞 {order.shippingInfo.phone}
                  </span>
                </p>

                <p>
                  <span className="text-gray-500">Address:</span>
                  <span className="block font-semibold">
                    {order.shippingInfo.address},{" "}
                    {order.shippingInfo.city},{" "}
                    {order.shippingInfo.state} –{" "}
                    {order.shippingInfo.pincode}
                  </span>
                </p>
              </div>
            )}

            {/* Items */}
            <div className="text-xs sm:text-sm space-y-1">
              {order.items.map((i, idx) => (
                <p key={idx}>
                  {i.title} × {i.qty}
                </p>
              ))}
            </div>

            {/* Total */}
            <p className="font-bold mt-3 text-[#355e3b] text-sm sm:text-base">
              Total: ₹ {order.total}
            </p>

          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-gray-500 text-sm">
            No orders here
          </p>
        )}

      </div>
    </div>
  );
}
