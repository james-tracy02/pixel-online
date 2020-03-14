
require('dotenv').config();
require('../database.js');
const canvasService = require('./canvas.js');

const { createCanvas, Image } = require('canvas');
const axios = require('axios');

const WIDTH = 1920;
const HEIGHT = 1080;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const cloudinary = require('cloudinary').v2;

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb, index) {
  return "#" + componentToHex(rgb[index]) + componentToHex(rgb[index + 1]) + componentToHex(rgb[index + 2]);
}

function convertToPixels(imgData) {
  const pixels = [];
  let i;
  for(i = 0; i < imgData.length; i += 1) {
    pixels.push(i)
  }
  /*
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
  */
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

async function fetchImage() {
  const canvasData = await canvasService.getLatest();
  return axios.get(canvasData.url,
  { responseType: 'arraybuffer' })
  .then(response => {
    const image = new Image();
    image.src = response.data;
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  });
}

function savePixels(pixels) {
  addPixelsToCanvas(pixels);
  cloudinary.uploader.upload(canvas.toDataURL('image/png'),
  { public_id: 'pixel_online_canvas' },
  (error, result) => {
    if(error) console.log(error);
    canvasService.save(result.url);
  });
}

module.exports = {
  fetchImage,
  savePixels,
};
