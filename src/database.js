
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

function connect() {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

module.exports = connect();