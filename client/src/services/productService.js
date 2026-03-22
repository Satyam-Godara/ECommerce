import axios from "axios";

// const API = "http://localhost:5000/api/products";
const API = "https://ecommerce-jlg9.onrender.com/api/products";

export const getProducts = () => axios.get(API);

export const getProduct = (id) => axios.get(`${API}/${id}`);
