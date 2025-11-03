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


router.get('/', verifyToken, async(req, res) => {
  try {
    const userWeapons = await UserWeapon.find({ })
      .populate('weapon')
      .populate('owner');

    res.status(200).json(userWeapons);
  } catch(err) {
    res.status(500).json({err: err.message});
  }
});

router.get('/:skinId', verifyToken, async(req, res) => {
  try {
    const skin = await UserWeapon.findById(req.params.skinId)
      .populate('weapon')
      .populate('owner');

    res.status(200).json(skin);
  } catch(err) {
    res.status(500).json({err: err.message});
  }
});

router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userWeapons = await UserWeapon.find({ owner: req.params.userId })
      .populate('weapon')
      .populate('owner'); 

    res.status(200).json(userWeapons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/weapons/data', verifyToken, async(req, res) => {
  try {
    const allWeapons = await Weapon.find({ });
    res.status(200).json(allWeapons);
  } catch(err) {
    res.status(500).json({err: err.message});
  }
});

router.put('/:skinId', verifyToken, async(req, res) => {
  try {
    const skin = await UserWeapon.findById(req.params.skinId);
    if(!skin.owner.equals(req.user._id)){
      return res.status(403).send('access denied');
    }

    skin.price = req.body.price;
    await skin.save();
    const updatedSkin = await skin.populate('weapon owner');
    res.status(200).json(updatedSkin);
  } catch(err){
    res.status(500).json({err: err.message});
  }
});

router.delete('/:skinId', verifyToken, async(req, res) => {
  try {
    const skin = await UserWeapon.findById(req.params.skinId);
    if(!skin.owner.equals(req.user._id)){
      return res.status(403).send('access denied');
    }

    const deletedSkin = await UserWeapon.findByIdAndDelete(req.params.skinId)
      .populate('weapon')
      .populate('owner');
    res.status(200).json({ message: 'Deleted successfully', deletedSkin });
  } catch(err) {
    res.status(500).json({err: err.message});
  }
});

module.exports = router;