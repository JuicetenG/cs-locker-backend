const mongoose = require('mongoose');

const userWeaponSchema = mongoose.Schema({
  weapon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weapon',
  },
  price: {
    type: Number,
    required: true,
  },
  float: {
    type: Number,
    required: true,
  },
  wearLevel: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const UserWeapon = mongoose.model('UserWeapon', userWeaponSchema);
module.exports = UserWeapon;