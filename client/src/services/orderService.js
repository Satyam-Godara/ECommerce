import axios from "axios";

const API = "http://ecommerce-jlg9.onrender.com/api/orders";

const getToken = () =>
  JSON.parse(localStorage.getItem("user"))?.token;

export const createOrder = (data) =>
  axios.post(`${API}/create`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const verifyPayment = (data) =>
  axios.post(`${API}/verify`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const getMyOrders = () =>
  axios.get(`${API}/my`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
