
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pixelSchema = new Schema({
  x: Number,
  y: Number,
  color: String,
});

const Pixel = mongoose.model('Pixel', pixelSchema);

module.exports = Pixel;
