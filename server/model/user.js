const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 15000 } ,
  trade: [
    {
      symbol: { type: String, required: true },
      name: { type: String, required: true },
      img: { type: String, required: true },
      share: { type: Number, required: true },
      costs: { type: Number, required: true },
    }
  ],
} ,
 { timestamps: true }
);



module.exports = mongoose.model('User', userSchema);
