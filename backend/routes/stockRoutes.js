// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockContoroller');

// GET all stocks
router.get('/', stockController.getAllStocks);

// POST a new stock
router.post('/', stockController.addStock);

// DELETE a stock by ID
router.delete('/:id', stockController.deleteStock);



module.exports = router;
