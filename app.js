
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

const PERSISTANCE_FREQ = 60000;
let memPixels;
let persistedIndex = 0;

app.post('/pixels', (req, res) => {
  const end = memPixels.length;
  const response = {
    index: end,
    pixels: memPixels.slice(req.body.index, end),
  };
  res.send(response);
  addPixelsToMem(req.body.pixels);
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

async function loadPixels() {
  const pixels = await pixelsService.getAllPixels();
  memPixels = pixels;
  persistedIndex = pixels.length;
}

function persistPixels() {
  const i = persistedIndex;
  persistedIndex = memPixels.length;
  if(i < memPixels.length) pixelsService.savePixels(memPixels.slice(i));
}

loadPixels();
setInterval(persistPixels, PERSISTANCE_FREQ);
app.listen(port);
