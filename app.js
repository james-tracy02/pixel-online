
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

let memPixels;

app.post('/pixels', (req, res) => {
  const end = memPixels.length;
  const response = {
    index: end,
    pixels: memPixels.slice(req.body.index, end),
  };
  res.send(response);
  addPixelsToMem(req.body.pixels);
  if(req.body.pixels.length > 0) pixelsService.savePixels(req.body.pixels);
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
}

loadPixels();
app.listen(port);
