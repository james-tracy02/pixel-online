
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

let basePixels = [];
let memPixels = [];
let count = 0;
const refresh = 2000;

app.get('/pixels', async (req, res) => {
  res.send(basePixels);
});

app.post('/pixels', (req, res) => {
  res.send(memPixels);
  count += req.body.pixels.length;
  addPixelsToMem(req.body.pixels);
  if(req.body.pixels.length > 0) pixelsService.savePixels(req.body.pixels);
  if(count > refresh) {
    count = 0;
    loadPixelsToMem();
  }
});

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.listen(port);

async function loadPixelsToMem() {
  const pixels = await pixelsService.getAllPixels();
  basePixels = pixels;
  memPixels = [];
}

function addPixelsToMem(pixels) {
  let i;
  for(i = 0; i < pixels.length; i += 1) {
    memPixels.push(pixels[i]);
  }
}

function getIndex(x, y) {
  return x * 1080 + y;
}

function hexToRGB(hex) {
  const decimal = parseInt(hex.substring(1), 10);
  return {
    r: decimal & 110000,
    g: decimal & 001100,
    b: decimal & 000011,
  };
}

loadPixelsToMem();
