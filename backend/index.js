// backend/index.js
require('dotenv').config();
const cors = require("cors")
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-trading'
const stockRoutes = require('./routes/stockRoutes'); // Stock routes file we'll create

app.use(express.json());

// Allow requests from localhost:5173 (your frontend)
app.use(cors({
    origin: 'http://localhost:5173',  // Specify allowed frontend origin
    methods: 'GET,POST,PUT,DELETE',   // Allowed methods (adjust as needed)
    allowedHeaders: 'Content-Type',   // Allowed headers
  }));

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));



app.get('/', (req, res) => {
    res.send('Backend is working');
});

app.use('/api/stocks', stockRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
