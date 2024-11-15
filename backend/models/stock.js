const express = require("express")
const app = express()
const mongoose = require("mongoose")

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  trend: { type: String, enum: ['up', 'down', 'neutral'], required: true },
  volume: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

 
module.exports = mongoose.model('Stock', StockSchema);
