// backend/index.js
require('dotenv').config();
const cors = require("cors")
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGO_URI 
const cryptoRoutes = require('./routes/stockRoutes');
const { fetchCryptoData} = require('./services/cryptoDataApi');

/* const symbols = [
    // Stock Symbols
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
    "NVDA", "META",  "DIS"/*, "NFLX", "BRK.B", "JNJ", "V",
    "WMT", "PG", "PEP",
    "KO", "MCD", "ADBE", "INTC", "XOM",
    
    // Currency Pairs
    "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF",
    "AUD/USD", "USD/CAD", "EUR/GBP", "USD/INR",
  
    // Cryptocurrency Symbols
    "BTC/USD", "ETH/USD", "BNB/USD", "XRP/USD",
    "ADA/USD", "SOL/USD", "DOGE/USD" ]; */


app.use(express.json());

// Allow requests from localhost:5173 (your frontend)
app.use(cors({
    origin: 'http://localhost:5173',  // Specify allowed frontend origin
    methods: 'GET,POST,PUT,DELETE',   // Allowed methods (adjust as needed)
    allowedHeaders: 'Content-Type',   // Allowed headers
  }));

/* mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err)); */


const fetchAndSaveData = async () => {
  console.log('Fetching stock data...');
  try {
      const data = await fetchCryptoData();;
    
    console.log('Stock data updated successfully');
  } catch (error) {
    console.error('Error during update:', error.message);
  }
};

app.use('/api', cryptoRoutes); // Add '/api/cryptos' as the endpoint

// Run every 15 minutes
setInterval(fetchAndSaveData, 15 * 60 * 1000);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
