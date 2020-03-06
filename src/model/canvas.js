
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const canvasSchema = new Schema({
  url: String,
  version: Number,
});
canvasSchema.index({version: -1});

const Canvas = mongoose.model('Canvas', canvasSchema, 'canvases');

module.exports = Canvas;
