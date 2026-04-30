import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-backend-6s9k.onrender.com",
  withCredentials: true,
});

export default api;