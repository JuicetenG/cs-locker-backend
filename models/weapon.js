const mongoose = require('mongoose');

const weaponSchema = mongoose.Schema({
  name: String,
  weapon: String,
  finish: String, 
  rarity: String, 
  image: String,
  color: String,
});

const Weapon = mongoose.model('Weapon', weaponSchema);
module.exports = Weapon;