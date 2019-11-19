const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv"); dotenv.config();
const port = process.env.PORT || 8080;

const Mongo = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const mongoClient = new Mongo(url);

mongoClient.connect((err) => {
  console.log(err);
  if(!err) {
    console.log('connected to mongo');
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/pixels', (req, res) => getAllPixels(req, res));
app.post('/pixels/:x/:y', (req, res) => colorPixel(req, res));

app.listen(port);

function getAllPixels(req, res) {
  const db = mongoClient.db();
  const pixels = db.collection('pixels');

  pixels.find()
  .then((pixels) => res.send(pixels));
}

function colorPixel(req, res) {
  const db = mongoClient.db();
  const pixels = db.collection('pixels');

  const newPixel = {
    x: req.params.x,
    y: req.params.y,
    color: req.body.color,
  };

  pixels.findOne({ x: newPixel.x, y: newPixel.y })
  .then((pixel) => {
    if(!pixel) {
      pixels.insertOne(newPixel);
    } else {
      pixels.replaceOne({ _id: pixel._id }, newPixel);
    }
  });
}
