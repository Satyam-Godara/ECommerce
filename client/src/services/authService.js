import axios from 'axios';

const API = 'https://ecommerce-jlg9.onrender.com/api/auth';

export const register = (data) => axios.post(`${API}/register`, data);

export const login = (data) => axios.post(`${API}/login`, data);
