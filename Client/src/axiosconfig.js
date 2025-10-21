// import axios from 'axios'
// const axiosInstance =axios.create({
//     baseURL:'http://localhost:5000/api',
//     //deployed version of evangadi server on render.com 
//    baseURL: "https://new-evangadiforum-backend.onrender.com"
// });
// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default axiosInstance;