
require('./database.js');
const Pixel = require('./pixel.js');

function getAllPixels() {
  return Pixel.find();
}

async function savePixels(pixels) {
  pixels.forEach((pixel) => {
    await savePixel(pixel);
  });
}

async function savePixel(newPixel) {
  const pixel = await Pixel.findOne({ x, y });
  if (!pixel) {
    return new Pixel({ newPixel.x, newPixel.y, newPixel.color }).save();
  }
  pixel.color = newPixel.color;
  return pixel.save();
}

module.exports = {
  getAllPixels,
  savePixels,
}
