import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:5173/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

export default axiosInstance;
