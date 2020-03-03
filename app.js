
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
const refresh = 5000;

app.get('/pixels', async (req, res) => {
  res.send(basePixels.concat(memPixels));
});

app.post('/pixels', (req, res) => {
  res.send(memPixels);
  count += req.body.pixels.length;
  addPixelsToMem(req.body.pixels);
  if(req.body.pixels.length > 0) pixelsService.savePixels(req.body.pixels);
  if(count > refresh) {
    count = 0;
    sendMemToBase(); // This may cause some clients to lose data, to compensate clients will load every minute or so.
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

function sendMemToBase() {
  let i;
  for(i = 0; i < memPixels.length; i += 1) {
    basePixels.push(memPixels[i]);
  }
  memPixels = [];
}

function addPixelsToMem(pixels) {
  let i;
  for(i = 0; i < pixels.length; i += 1) {
    memPixels.push(pixels[i]);
  }
}

loadPixelsToMem();
