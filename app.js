
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

let memPixels = [];

app.get('/pixels', async (req, res) => {
  res.send(memPixels);
});

app.post('/pixels', (req, res) => {
  res.send(memPixels);
  addPixelsToMem(req.body.pixels);
  if(req.body.pixels.length > 0)
    pixelsService.savePixels(req.body.pixels);
});

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.listen(port);

async function loadPixelsToMem() {
  const pixels = await pixelsService.getAllPixels();
  memPixels = pixels;
}

function addPixelsToMem(pixels) {
  let i;
  for(i = 0; i < pixels.length; i += 1) {
    memPixels.push(pixels[i]);
  }
}

loadPixelsToMem();
setInterval(loadPixelsToMem, 600000);
