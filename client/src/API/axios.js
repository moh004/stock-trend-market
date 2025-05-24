import axios from "axios";


const  apiClient = axios.create({
    baseURL: 'http://stock-trend-market.railway.internal/api',
    headers: { "Content-Type": "application/json"},
    withCredentials: true // 👈 it's required for the cookies
})

export default apiClient