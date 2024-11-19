// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { fetchCryptoData } = require('../services/cryptoDataApi');



router.get('/cryptos', async (req, res) => {
  try {
    const data = await fetchCryptoData();
    res.status(200).json(data); // Send the fetched crypto data to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch crypto data', error: error.message });
  }
});

module.exports = router;
