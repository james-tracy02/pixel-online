
require('./database.js');
const Pixel = require('./pixel.js');

function getAllPixels() {
  return Pixel.find();
}

async function savePixels(pixels) {
  await Pixel.insertMany(pixels);
}

async function savePixel(newPixel) {
  const pixel = await Pixel.findOne({ x: newPixel.x, y: newPixel.y });
  if (!pixel) {
    return new Pixel({ x: newPixel.x, y: newPixel.y, color: newPixel.color }).save();
  }
  pixel.color = newPixel.color;
  return pixel.save();
}

module.exports = {
  getAllPixels,
  savePixels,
}
