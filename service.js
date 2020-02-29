
require('./database.js');
const Pixel = require('./pixel.js');

function getAllPixels() {
  return Pixel.find();
}

async function colorPixel(x, y, color) {
  const pixel = await Pixel.findOne({ x, y });
  if (!pixel) {
    return new Pixel({ x, y, color }).save();
  }
  pixel.color = color;
  return pixel.save();
}

module.exports = {
  getAllPixels,
  colorPixel,
}
