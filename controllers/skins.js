const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");

const User = require('../models/user');
const Weapon = require('../models/weapon.js');
const UserWeapon = require('../models/user-weapon.js');


router.post('/', verifyToken, async(req, res) => {
  try {
    const weaponNew = await Weapon.findOne({ name: req.body.weapon });
    let wearLevel = req.body.float;
    
    if(wearLevel > 0.00 && wearLevel <= 0.07) {
      wearLevel = 'Factory New';
    } else if(wearLevel <= 0.15) {
      wearLevel = 'Minimal Wear';
    } else if(wearLevel <= 0.38) {
      wearLevel = 'Field Tested';
    } else if(wearLevel <= 0.45) {
      wearLevel = 'Well Worn';
    } else wearLevel = 'Battle Scarred';

    req.body.owner = req.user._id;
    const weapon = await UserWeapon.create({
      weapon: weaponNew._id,
      price: Number(req.body.price),
      float: Number(req.body.float),
      wearLevel: wearLevel,
      owner: req.user._id,
    });
    res.status(201).json(weapon);
  } catch(err) {
    res.status(500).json({err: err.message});
  }
});


module.exports = router;