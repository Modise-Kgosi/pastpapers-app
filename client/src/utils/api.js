import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocalhost
  ? "http://localhost:5000/api"
  : "https://your-production-backend-url/api"; // TODO: replace with your deployed backend URL

const api = axios.create({
  baseURL,
});

export default api;