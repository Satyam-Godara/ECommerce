import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

export default function Orders() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getMyOrders();

      // ✅ new backend structure
      setPending(res.data.pending || []);
      setCompleted(res.data.completed || []);

      setLoading(false);
    };

    fetchOrders();
  }, []);

  /* =========================
     Status Color
  ========================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-blue-500";
      case "Delivered":
        return "bg-green-600";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  /* =========================
     Date Format
  ========================= */
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  /* =========================
     Reusable Card
  ========================= */
  const OrderCard = ({ order }) => (
    <div className="border rounded-xl shadow p-4 mb-5 bg-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="font-semibold">
            Order ID: {order._id.slice(-6)}
          </p>

          <p className="text-sm text-gray-500">
            {formatDate(order.orderDate)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      {/* Items */}
      {order.items.map((item, i) => (
        <div key={i} className="flex gap-3 items-center mb-2">
          <img
            src={item.image}
            alt={item.title}
            className="w-14 h-14 rounded object-cover"
          />

          <div className="flex-1">
            <p>{item.title}</p>
            <p className="text-sm text-gray-500">
              ₹ {item.price} × {item.qty}
            </p>
          </div>
        </div>
      ))}

      <p className="mt-3 font-bold text-right">
        Total: ₹ {order.total}
      </p>
    </div>
  );

  /* =========================
     UI
  ========================= */

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (pending.length === 0 && completed.length === 0)
    return <p className="p-6">No orders yet</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      <h2 className="text-3xl font-bold">My Orders</h2>

      {/* =========================
           PENDING SECTION
      ========================= */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-yellow-600">
            Ongoing Orders
          </h3>

          {pending.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      {/* =========================
           COMPLETED SECTION
      ========================= */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-green-600">
            Completed Orders
          </h3>

          {completed.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
