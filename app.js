const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const Mongo = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const mongoClient = new Mongo(url);

mongoClient.connect((err) => {
  if(!err) {
    console.log('connected to mongo');
  }
});

const db = mongoClient.db();
const pixels = db.collection('pixels');

app.use(cors());
app.use(bodyParser.json());

app.get('/pixels', (req, res) => getAllPixels(req, res));
app.post('/pixels/:x/:y', (req, res) => colorPixel(req, res));

app.listen(port);

function getAllPixels(req, res) {
  //retrieve from database
  // .then
  //res.send(result);
}

function colorPixel(req, res) {
  const x = req.params.x;
  const y = req.params.y;
  const color = req.body.color;

  // write to database
}
