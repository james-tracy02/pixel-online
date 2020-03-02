
require('./database.js');
const Pixel = require('./pixel.js');

function getAllPixels() {
  return Pixel.find();
}

async function savePixels(pixels) {
  const bulkOps = [];
  for(let i = 0; i < pixels.length; i += 1) {
    const pixel = pixels[i];
    if(pixel.color === '#ffffff' || pixel.color === '#FFFFFF') {
      bulkOps.push(
        { delteOne:
           { filter: { x: pixel.x, y: pixel.y } }
        });
    } else {
    bulkOps.push(
      { updateOne:
        {
          filter: { x: pixel.x, y: pixel.y },
          update: pixel,
          upsert: true,
        }
      });
    }
  }

  Pixel.collection.bulkWrite(bulkOps);
}

module.exports = {
  getAllPixels,
  savePixels,
}
