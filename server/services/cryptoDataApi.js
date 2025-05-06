
require("dotenv").config()
const axios = require('axios');

const apiKey = process.env.COINGECKO_API_DAILY_KEY;
const baseURL = 'https://api.coingecko.com';

const fetchCryptoData = async () => {
  const url = `${baseURL}/api/v3/coins/markets?vs_currency=usd&x_cg_demo_api_key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data; // JSON response from CoinGecko
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    throw new Error(error.message);
  }
};



 module.exports = { fetchCryptoData };
