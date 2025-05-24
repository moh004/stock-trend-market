
const dotenv = require('dotenv')
dotenv.config()
const cors = require("cors")
const express = require('express');
const app = express();
const PORT = process.env.PORT ;
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGO_URI ;
const DBStore = require("connect-mongo");
const session = require("express-session");
const routes = require('./routes/routes');
const { fetchCryptoData} = require('./services/cryptoDataApi');
const{ setCryptoData }= require("./cache/cache.js")



app.use(express.json());

app.use(cors({
  origin: 'https://stock-trend-market.vercel.app',  
  methods: 'GET,POST,PUT,DELETE',   
  credentials: true, // Allows cookies/sessions
  allowedHeaders: ['Content-Type', 'Authorization']  
}));

app.set("trust proxy", 1); // trust first proxy (needed for secure cookies )

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: DBStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "session"
    }),
    cookie: {
      httpOnly: true ,
      secure: true, // change it when HTTPS
      sameSite: "none",  // when it's in production 
      maxAge : 10 * 24 * 60 * 60 * 1000
    }
  })
)

// Routes
app.use('/api', routes); 



mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));


const fetchAndSaveData = async () => {
  console.log('Fetching stock data...');
  try {
      const response = await fetchCryptoData();
      
      setCryptoData(response);
  } catch (error) {
    console.error('Error during update:', error.message);
  }
};


fetchAndSaveData();
// Run every 10 minutes
setInterval(fetchAndSaveData, 10 * 60 * 1000);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
