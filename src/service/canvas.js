
require('../database.js')
const Canvas = require('../model/canvas.js');

async function getLatest() {
  const latest = await Canvas.find().sort({ version: -1 }).limit(1);
  return latest[0];
}

async function save(url) {
  const latest = await getLatest();
  new Canvas({
    url,
    version: latest.version + 1,
  }).save();
}

module.exports = {
  save,
  getLatest,
}
