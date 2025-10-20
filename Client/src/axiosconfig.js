import axios from 'axios'
const axiosInstance =axios.create({
    baseURL:'http://localhost:5000/api',
    //deployed version of evangadi server on render.com 
   baseURL: "https://new-evangadiforum-backend.onrender.com"
});
export default axiosInstance;