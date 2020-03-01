
require('./database.js');
const Pixel = require('./pixel.js');

function getAllPixels() {
  return Pixel.find();
}

async function savePixels(pixels) {
  for(let i = 0; i < pixels.length; i++) {
    await savePixel(pixels[i]);
  }
}

async function savePixel(newPixel) {
  const pixel = await Pixel.findOne({ x, y });
  if (!pixel) {
    return new Pixel({ x: newPixel.x, y: newPixel.y, xolor: newPixel.color }).save();
  }
  pixel.color = newPixel.color;
  return pixel.save();
}

module.exports = {
  getAllPixels,
  savePixels,
}
