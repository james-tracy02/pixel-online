
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./pixelsService.js');
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

const SAVE_FREQ = 1000 * 60 * 20;
let saveTimeout;
let memPixels;

app.post('/pixels', (req, res) => {
  const end = memPixels.length;
  const response = {
    index: end,
    pixels: memPixels.slice(req.body.index, end),
  };
  res.send(response);
  addPixelsToMem(req.body.pixels);

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(savePixels, SAVE_FREQ);
});

app.get('/ping', (req, res) => {
  res.send('ok');
});

function addPixelsToMem(pixels) {
  let i;
  for(let i = 0; i < pixels.length; i += 1) {
    memPixels.push(pixels[i]);
  }
}

function loadPixels() {
  return pixelsService.fetchPixels()
  .then((pixels) => memPixels = pixels);
}

function savePixels() {
  pixelsService.savePixels(memPixels);
}

loadPixels()
.then(() => {
  saveTimeout = setTimeout(savePixels, SAVE_FREQ);
  app.listen(port);
});
