// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:5000/api/products";
// const ORDER_API = "http://localhost:5000/api/orders";

// export default function AdminDashboard() {
//   const token = JSON.parse(localStorage.getItem("user"))?.token;

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   // =========================
//   // STATES
//   // =========================
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("Pending");

//   const emptyForm = {
//     title: "",
//     description: "",
//     price: "",
//     stock: "",
//     category: "",
//     image: "",
//   };

//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);
//   const [loadingImage, setLoadingImage] = useState(false);

//   // =========================
//   // FETCH
//   // =========================
//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   const fetchProducts = async () => {
//     const res = await axios.get(API);
//     setProducts(res.data);
//   };

//   const fetchOrders = async () => {
//     const res = await axios.get(`${ORDER_API}/admin/all`, { headers });
//     setOrders(res.data);
//   };

//   // =========================
//   // PRODUCT LOGIC
//   // =========================
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const uploadImage = async (file) => {
//     setLoadingImage(true);

//     const formData = new FormData();
//     formData.append("image", file);

//     const res = await axios.post(`${API}/upload`, formData, { headers });

//     setLoadingImage(false);
//     return res.data.url;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editingId)
//       await axios.put(`${API}/${editingId}`, form, { headers });
//     else
//       await axios.post(API, form, { headers });

//     setForm(emptyForm);
//     setEditingId(null);
//     fetchProducts();
//   };

//   const editProduct = (p) => {
//     setForm(p);
//     setEditingId(p._id);
//     window.scrollTo(0, 0);
//   };

//   const deleteProduct = async (id) => {
//     await axios.delete(`${API}/${id}`, { headers });
//     fetchProducts();
//   };

//   // =========================
//   // ORDER LOGIC
//   // =========================
//   const updateStatus = async (id, status) => {
//     await axios.patch(
//       `${ORDER_API}/admin/${id}`,
//       { status },
//       { headers }
//     );
//     fetchOrders();
//   };

//   const statuses = ["Pending","Booked", "Shipped", "Delivered", "Cancelled"];

//   const filteredOrders = orders.filter(
//     (o) => o.status === activeTab
//   );


//   const formatDate = (date) => {
//     return new Date(date).toLocaleString();
//   };
//   // =========================
//   // UI
//   // =========================
//   return (
//     <div className="p-8 max-w-7xl mx-auto">

//       <h1 className="text-3xl font-bold mb-8 text-brown-400">
//         🌿 Admin Dashboard
//       </h1>

//       {/* ======================================================
//          PRODUCTS SECTION (same logic, cleaner look)
//       ====================================================== */}
//       <div className="bg-white p-6 rounded-2xl shadow mb-10">
//         <h2 className="text-xl font-semibold mb-4">📦 Manage Products</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//           <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
//           <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" className="border p-2 rounded" required />
//           <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="Stock" className="border p-2 rounded" />
//           <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />

//           <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-2" />

//           <input
//             type="file"
//             onChange={async (e) => {
//               const url = await uploadImage(e.target.files[0]);
//               setForm({ ...form, image: url });
//             }}
//             className="col-span-2"
//           />

//           {loadingImage && <p>Uploading image...</p>}

//           <button className="bg-green-900 text-white py-2 rounded col-span-2">
//             {editingId ? "Update" : "Create"}
//           </button>
//         </form>
//       </div>
// {/* ================= PRODUCT TABLE ================= */}
//       <div className="grid gap-4">

//         {products.map((p) => (
//           <div
//             key={p._id}
//             className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-4">
//               <img
//                 src={p.image}
//                 className="h-16 w-16 object-cover rounded"
//               />

//               <div>
//                 <h3 className="font-semibold">{p.title}</h3>
//                 <p>₹ {p.price}</p>
//                 <p className="text-sm text-gray-500">
//                   Stock: {p.stock}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => editProduct(p)}
//                 className="bg-yellow-400 px-3 py-1 rounded"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => deleteProduct(p._id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}

//       </div>
//       {/* ======================================================
//          ORDERS SECTION (PRO VERSION)
//       ====================================================== */}
//       <h2 className="text-2xl font-bold mb-4">📦 Orders Management</h2>

//       {/* Tabs */}
//       <div className="flex gap-3 mb-6">
//         {statuses.map((s) => (
//           <button
//             key={s}
//             onClick={() => setActiveTab(s)}
//             className={`px-4 py-2 rounded-xl font-medium shadow
//               ${activeTab === s
//                 ? "bg-green-900 text-white"
//                 : "bg-gray-100"}`}
//           >
//             {s} (
//             {orders.filter(o => o.status === s).length}
//             )
//           </button>
//         ))}
//       </div>

//       {/* Orders Cards */}
//       <div className="grid gap-5">

//         {filteredOrders.map((order) => (
//           <div
//             key={order._id}
//             className="bg-white rounded-2xl shadow-lg p-6"
//           >
//             {/* HEADER */}
//             <div className="flex justify-between mb-3">
//               <div>
//                 <p className="font-semibold">
//                   {order.user?.name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {order.user?.email}
//                 </p>
//               </div>

//               <select
//                 value={order.status}
//                 onChange={(e) =>
//                   updateStatus(order._id, e.target.value)
//                 }
//                 className="border px-3 py-1 rounded"
//               >
//                 {statuses.map((s) => (
//                   <option key={s}>{s}</option>
//                 ))}
//               </select>
//             </div>




//             {/* SHIPPING INFO */}
//             {/* {order.shippingInfo && (
//               <div className="bg-gray-50 p-3 rounded text-sm mb-3">
//                 <p className="font-semibold">
//             Order ID: {order._id.slice(-6)}
//           </p>

//           <p className="text-sm text-gray-500">
//             {formatDate(order.orderDate)}
//           </p>
                
//                 Name : <b>{order.shippingInfo.name}</b>
//                 <p>Mobile No. :📞<b> {order.shippingInfo.phone}</b></p>
//                 <p>
//                   Address : <b>
//                   {order.shippingInfo.address},{" "}
//                   {order.shippingInfo.city},{" "}
//                   {order.shippingInfo.state} -{" "}
//                   {order.shippingInfo.pincode}
//                   </b>
//                 </p>

                
//               </div>
              
//             )} */}
//             {order.shippingInfo && (
//               <div className="bg-white shadow-md border rounded-xl p-4 mb-4 text-sm space-y-3">

//                 {/* Header */}
//                 <div className="flex justify-between items-center border-b pb-2">
//                   <h3 className="text-base font-bold text-gray-800">
//                     Order #{order._id.slice(-6)}
//                   </h3>

//                   <span className="text-xs text-gray-500">
//                     {formatDate(order.orderDate)}
//                   </span>
//                 </div>

//                 {/* Customer Info */}
//                 <div className="grid gap-2 text-gray-700">

//                   <p>
//                     <span className="font-medium text-gray-500">Name:</span>{" "}
//                     <span className="font-semibold text-black text-base">
//                       {order.shippingInfo.name}
//                     </span>
//                   </p>

//                   <p>
//                     <span className="font-medium text-gray-500">Mobile:</span>{" "}
//                     <span className="font-semibold text-blue-600 text-base">
//                       📞 {order.shippingInfo.phone}
//                     </span>
//                   </p>

//                   <p>
//                     <span className="font-medium text-gray-500">Address:</span>
//                     <span className="block font-semibold text-black leading-relaxed">
//                       {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
//                       {order.shippingInfo.state} – {order.shippingInfo.pincode}
//                     </span>
//                   </p>

//                 </div>
//               </div>
//             )}
//             {/* ITEMS */}
//             <div className="text-sm space-y-1">
//               {order.items.map((i, idx) => (
//                 <p key={idx}>
//                   {i.title} × {i.qty}
//                 </p>
//               ))}
//             </div>

//             {/* TOTAL */}
//             <p className="font-bold mt-3">
//               Total: ₹ {order.total}
//             </p>
//           </div>
//         ))}

//         {filteredOrders.length === 0 && (
//           <p className="text-gray-500">No orders here</p>
//         )}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://ecommerce-jlg9.onrender.com/api/products";
const ORDER_API = "http://ecommerce-jlg9.onrender.com/api/orders";

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
    window.scrollTo(0, 0);
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
    <div className="bg-[#fdf6ee] min-h-screen px-6 md:px-16 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-serif font-bold text-[#5e3e2d] mb-10">
        🌿 Ayurveda Admin Panel
      </h1>

      {/* ======================================================
         PRODUCTS SECTION
      ====================================================== */}

      <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl mb-12 border border-[#f2e6d9]">
        <h2 className="text-2xl font-semibold text-[#5e3e2d] mb-6">
          📦 Manage Products
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

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
            className="border border-[#e8d8c5] p-3 rounded-xl col-span-2 focus:ring-2 focus:ring-[#8c5a3c]"
          />

          <input
            type="file"
            onChange={async (e) => {
              const url = await uploadImage(e.target.files[0]);
              setForm({ ...form, image: url });
            }}
            className="col-span-2"
          />

          {loadingImage && (
            <p className="text-sm text-gray-500 col-span-2">
              Uploading image...
            </p>
          )}

          <button className="bg-[#8c5a3c] hover:bg-[#6f452f] text-white py-3 rounded-full col-span-2 font-semibold shadow-md transition">
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      {/* ================= PRODUCT LIST ================= */}

      <div className="grid gap-4 mb-14">

        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">

              <img
                src={p.image}
                alt={p.title}
                className="h-16 w-16 object-cover rounded-xl"
              />

              <div>
                <h3 className="font-semibold text-[#5e3e2d] text-lg">
                  {p.title}
                </h3>

                <p className="text-[#355e3b] font-medium">
                  ₹ {p.price}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {p.stock}
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => editProduct(p)}
                className="bg-[#355e3b] hover:bg-[#2a4a2f] text-white px-4 py-1.5 rounded-full text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* ======================================================
         ORDERS SECTION
      ====================================================== */}

      <h2 className="text-3xl font-semibold text-[#5e3e2d] mb-6">
        📦 Orders Management
      </h2>

      {/* Tabs */}

      <div className="flex gap-3 mb-6 flex-wrap">

        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-5 py-2 rounded-full font-medium shadow-sm transition
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

      {/* ORDERS */}

      <div className="grid gap-5">

        {filteredOrders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition p-6 border border-[#f2e6d9]"
          >

            {/* HEADER */}

            <div className="flex justify-between mb-3">

              <div>
                <p className="font-semibold">{order.user?.name}</p>

                <p className="text-sm text-gray-500">
                  {order.user?.email}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border border-[#e8d8c5] px-3 py-1 rounded-lg"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

            </div>

            {/* SHIPPING */}

            {order.shippingInfo && (
              <div className="bg-[#fdf6ee] border border-[#e8d8c5] rounded-2xl p-4 mb-4 text-sm space-y-3">

                <div className="flex justify-between items-center border-b pb-2">

                  <h3 className="font-bold text-gray-800">
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

            {/* ITEMS */}

            <div className="text-sm space-y-1">

              {order.items.map((i, idx) => (
                <p key={idx}>
                  {i.title} × {i.qty}
                </p>
              ))}

            </div>

            {/* TOTAL */}

            <p className="font-bold mt-3 text-[#355e3b]">
              Total: ₹ {order.total}
            </p>

          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-gray-500">
            No orders here
          </p>
        )}

      </div>
    </div>
  );
}