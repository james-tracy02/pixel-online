
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({limit: '1mb'}));

let memPixels = [];
let hasLoaded = false;

app.get('/pixels', async (req, res) => {
  if(!hadLoaded) {
    hasLoaded = true;
    memPixels = await pixelsService.getAllPixels();
  }
  res.send(memPixels);
});

app.post('/pixels', (req, res) => {
  memPixels = memPixels.concat(req.body.pixels);
  res.send(memPixels);
  pixelsService.savePixels(req.body.pixels);
});

app.listen(port);
