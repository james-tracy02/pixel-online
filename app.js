
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({limit: '1mb'}));

let memPixels = new Map();
let hasLoaded = false;

app.get('/pixels', async (req, res) => {
  if(!hasLoaded) {
    hasLoaded = true;
    const pixels = await pixelsService.getAllPixels();
    addPixelsToMem(pixels);
  }
  res.send(getPixelsFromMem());
});

app.post('/pixels', (req, res) => {
  res.send(getPixelsFromMem());
  addPixelsToMem(req.body.pixels);
  if(req.body.pixels.length > 0)
    pixelsService.savePixels(req.body.pixels);
});

app.listen(port);

function addPixelsToMem(pixels) {
  let i;
  for(i = 0; i < pixels.length; i += 1) {
    const pixel = pixels[i];
    if(pixel.color === '#ffffff' || pixel.color === '#FFFFFF') {
      console.log('delete');
      memPixels.delete({x: pixel.x, y: pixel.y});
    } else {
      memPixels.set({x: pixel.x, y: pixel.y}, pixel);
    }
  }
}

function getPixelsFromMem() {
  return Array.from(memPixels, (item) => item[1]);
}
