
require('dotenv').config();
const mongo = require('mongodb');
const client = new mongo.MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const { createCanvas, Image } = require('canvas');
const axios = require('axios');

const WIDTH = 1920;
const HEIGHT = 1080;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const cloudinary = require('cloudinary').v2;

async function loadUrl() {
  const db = client.db('heroku_nxl1c47m');
  const { url } = await db.collection('urls').findOne({ _id: mongo.ObjectId('5e61cae07c213e3443e8e010') });
  return url;
}

async function writeUrl(url) {
  console.log(url);
  const db = client.db('heroku_nxl1c47m');
  await db.collection('urls').updateOne({ _id: mongo.ObjectId('5e61cae07c213e3443e8e010') }, { $set: { url: url }});
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb, index) {
  return "#" + componentToHex(rgb[index]) + componentToHex(rgb[index + 1]) + componentToHex(rgb[index + 2]);
}

function convertToPixels(imgData) {
  const pixels = [];
  let y;
  for(y = 0; y < HEIGHT; y += 1) {
    let x;
    for(x = 0; x < WIDTH; x += 1) {
      const index = (y * WIDTH + x) * 4;
      const color = rgbToHex(imgData, index);
      if(color === '#ffffff') continue;
      const pixel = {
        x,
        y,
        color,
      };
      pixels.push(pixel);
    }
  }
  return pixels;
}

function addPixelsToCanvas(pixels) {
  let i;
  for(i = 0; i < pixels.length; i += 1) {
    const pixel = pixels[i];
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, 1, 1);
  }
}

async function fetchPixels() {
  const url = await loadUrl();
  return axios.get(url,
  { responseType: 'arraybuffer' })
  .then(response => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const image = new Image();
    image.src = response.data;
    ctx.drawImage(image, 0, 0);
    return convertToPixels(ctx.getImageData(0, 0, WIDTH, HEIGHT).data);
  });
}

function savePixels(pixels) {
  addPixelsToCanvas(pixels);
  cloudinary.uploader.upload(canvas.toDataURL('image/png'),
  { public_id: 'pixel_online_canvas' },
  (error, result) => {
    if(error) console.log(error);
    writeUrl(result.url);
  });
}

module.exports = {
  fetchPixels,
  savePixels,
};
