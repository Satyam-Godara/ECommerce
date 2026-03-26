import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

export default function Orders() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setPending(res.data.pending || []);
        setCompleted(res.data.completed || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* =========================
     Status Color + Label
  ========================= */
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* =========================
     Date Format
  ========================= */
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  /* =========================
     ORDER CARD
  ========================= */
  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 sm:p-5 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <p className="font-semibold text-[#5e3e2d] text-sm sm:text-base">
            Order ID: #{order._id.slice(-6)}
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            {formatDate(order.orderDate)}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium w-fit ${getStatusStyle(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      {/* ITEMS */}
      <div className="space-y-3">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 items-center border-b pb-2 last:border-none"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-800">
                {item.title}
              </p>

              <p className="text-xs sm:text-sm text-gray-500">
                ₹ {item.price} × {item.qty}
              </p>
            </div>

            <p className="text-sm font-semibold text-[#5e3e2d]">
              ₹ {item.price * item.qty}
            </p>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {order.items.length} item(s)
        </p>

        <p className="text-lg font-bold text-[#355e3b]">
          ₹ {order.total}
        </p>
      </div>
    </div>
  );

  /* =========================
     LOADING / EMPTY STATES
  ========================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (pending.length === 0 && completed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-semibold text-[#5e3e2d] mb-2">
          No Orders Yet 🛒
        </h2>
        <p className="text-gray-500 mb-4">
          Looks like you haven’t placed any orders yet.
        </p>
        <a
          href="/products"
          className="bg-[#355e3b] text-white px-6 py-2 rounded-full hover:bg-[#24492b]"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-10">

      <h2 className="text-2xl sm:text-3xl font-bold text-[#5e3e2d]">
        My Orders
      </h2>

      {/* PENDING */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-600">
            Ongoing Orders
          </h3>

          <div className="space-y-5">
            {pending.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* COMPLETED */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-600">
            Completed Orders
          </h3>

          <div className="space-y-5">
            {completed.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
