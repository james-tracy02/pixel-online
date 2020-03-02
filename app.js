
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({limit: '1mb'}));


const memPixels = [];

app.get('/pixels/persisted', async (req, res) => {
  const pixels = await pixelsService.getAllPixels();
  res.send(pixels.concat(memPixels));
});

app.get('/pixels', (req, res) => {
  res.send(memPixels);
});

app.post('/pixels', (req, res) => {
  memPixels.concat(req.body.pixels);
  res.send(memPixels);
  pixelsService.savePixels(req.body.pixels);
});

app.listen(port);
