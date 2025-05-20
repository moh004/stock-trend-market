// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const {getCryptoData} = require("../cache/cache.js");

function getCryptoPrice (symbol) {
    const data =  getCryptoData()
    return data.find( coin => coin.symbol === symbol ) 
}


//POST
router.post("/register" , async (req , res) => {
  const {username , password , email} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({username , email , password : hashedPassword})
      req.session.user = {id : newUser._id, username: newUser.username , balance: newUser.balance}
     return res.status(201).json({message: "user is added!"})
  }
  catch(e){
    // 11000 code for same user 
    if(e.code === 11000){
         
        return res.status(400).json({message: "Username or Email already exists."});
    }
    console.log(e)
    return res.status(500).json({message: "Failed to register user"})
  }
});

router.post("/login" , async (req , res) => {
  const { password , email} = req.body;
  try {
      const ourUser = await User.findOne({email : email})
      
      if(!ourUser){
         return res.status(404).json({message: "user not found"})
      }

      const isPasswordValid = await bcrypt.compare(password , ourUser.password);

      if(!isPasswordValid){
          return res.status(404).json({message: "password is wrong."})
      }

    req.session.user = {id : ourUser._id, username: ourUser.username , balance: ourUser.balance}
     return res.status(202).json({message: "user is logged!"})
  }
  catch(e){
    console.log(e)
    return res.status(500).json({message: "Failed to login"})
  }
});

router.post("/buy" , async (req , res) => {
  if(!req.session.user){
    return res.status(401).json({message: "please LogIn!"})
  }
  const {symbol , share , costs , name , img} = req.body;
  try{
    const ourUser =  await User.findOne({username : req.session.user.username});
   
    if(ourUser.balance < costs) {
      return res.status(500).json({message : "you don't have enough money/credit"})
    }
    // if user have bought same coin we dont creater new trade we just add the the costs and share to DB
    const sameTrade = ourUser.trade.find(coin => coin.symbol === symbol);
    if(sameTrade) {
          sameTrade.share += share;
          sameTrade.costs += costs;
          ourUser.balance -= costs;
          await ourUser.save();
          req.session.user = {id : ourUser._id, username: ourUser.username , balance: ourUser.balance};
          return res.status(200).json({message: "Successful Trade"})
    }
    // new coin trade
    ourUser.trade.push({symbol , share , costs, name, img });
    ourUser.balance -= costs;
    await ourUser.save();
    req.session.user = {id : ourUser._id, username: ourUser.username , balance: ourUser.balance}
    return res.status(201).json({message: "Successful Trade"})
  }
  catch(e){
    return res.status(500).json({ message: "Failed to save trade" });
  }
})

router.post('/sell', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please log in!' });
  }

  const { id, sellShare, symbol } = req.body;
  

  try {
    const user = await User.findOne({username : req.session.user.username})
    const trade = user.trade.id(id);

    if (!trade || sellShare > trade.share) {
      return res.status(400).json({ error: 'Invalid trade or share amount' });
    }

    const pricePerShare = getCryptoPrice(symbol).current_price ;
    const refund = pricePerShare * sellShare;

    trade.share -= sellShare;
   if (trade.share <= 0.000001) {
        trade.share = 0;
        
   };


    user.balance += refund;
    await user.save();

    // Update session balance
    req.session.user.balance = user.balance;

    res.json({ success: true, balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process sell request' });
  }
});



//DELETE 

router.delete("/logout" , (req,res) => {
      req.session.destroy((error) => {
        if(error){
          return  res.status(500).json({message: "LogOut faild"})
        }
        
        res.clearCookie("connect.sid");

        return res.status(200).json({message: "Successful Logout!"})

      })
})


//GET
router.get('/crypto',  (req, res) => {
  try {
    const data =  getCryptoData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch crypto data', error: error.message });
  }
});

router.get("/check-auth", async (req, res) => {
    
  if (!req.session.user) {
    return res.json({ isAuthenticated: false });
}

try {
    const user = await User.findById(req.session.user.id)
    if (!user) {
        return res.status(404).json({ isAuthenticated: false });
    }

   return res.status(200).json({ isAuthenticated: true, user });
} catch (error) {
    console.error("Auth check error:", error);
  return  res.status(500).json({ isAuthenticated: false });
}
})

module.exports = router;
