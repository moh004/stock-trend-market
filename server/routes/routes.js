// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { fetchCryptoData } = require('../services/cryptoDataApi');
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const {getCryptoData} = require("../cache/cache.js")


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
