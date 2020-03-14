
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./src/service/pixel.js');
const app = express();
const port = process.env.PORT || 8080;
const SAVE_FREQ = 1000 * 60 * 20;

let saveTimeout;
const memPixels = [];
let memImage;

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

app.get('/pixels', (req, res) => {
  res.send(memImage);
});

app.post('/pixels', (req, res) => {
  const end = memPixels.length;
  const response = {
    index: end,
    pixels: memPixels.slice(req.body.index, end),
  };
  res.send(response);

  Array.prototype.push.apply(memPixels, req.body.pixels);
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(savePixels, SAVE_FREQ);
});

function loadImage() {
  return pixelsService.fetchImage()
  .then((image) => memImage = image);
}

function savePixels() {
  pixelsService.savePixels(memPixels);
}

loadImage()
.then(() => {
  saveTimeout = setTimeout(savePixels, SAVE_FREQ);
  app.listen(port);
});
