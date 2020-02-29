
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelsService = require('./service.js');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/pixels', async (req, res) => {
  const pixels = await pixelsService.getAllPixels();
  res.send(pixels);
});

app.post('/pixels/:x/:y', async (req, res) => {
  const pixel = await pixelsService.colorPixel(req.params.x, req.params.y, req.body.color);
  res.send(pixel);
});

app.listen(port);
