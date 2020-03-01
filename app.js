
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

app.post('/pixels', async (req, res) => {
  await pixelsService.colorPixel(req.body.pixels);
  res.send('ok');
});

app.listen(port);
