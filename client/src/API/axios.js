import axios from "axios";


const  apiClient = axios.create({
    baseURL: 'https://stock-trend-market-2.onrender.com/api',
    headers: { "Content-Type": "application/json"},
    withCredentials: true // 👈 it's required for the cookies
})

export default apiClient