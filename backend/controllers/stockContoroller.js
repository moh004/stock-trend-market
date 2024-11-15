//to handle the logic for each API route.

const Stock = require("../models/stock.js")

// Get all stock data
exports.getAllStocks = async (req, res) => {
    try {
      const stocks = await Stock.find();
      res.status(200).json(stocks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



// Add new stock data
exports.addStock = async (req, res) => {
  console.log(req.body.symbol)
    const stock = new Stock({
      symbol:  req.body.symbol,
        name:  req.body.name,
       price:  req.body.price,
       trend:  req.body.trend,
       volume: req.body.volume,
        date:  req.body.date
    });
  
    try {
      const newStock = await stock.save();
      res.status(201).json(newStock);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Delete stock data
  exports.deleteStock = async (req, res) => {
    try {
      const stock = await Stock.findById(req.params.id);
      if (!stock) return res.status(404).json({ message: 'Stock not found' });
  
      await Stock.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Stock deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };