const database = require('../database.js');
const { DataTypes, Op } = require("sequelize");

const Canvas = database.define("canvas",
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    timestamps: false
  });
Canvas.removeAttribute("id");

async function getLatest() {
  const latest = await Canvas.findAll({order: [['version', 'DESC']]});
  return latest[0];
}

async function save(url) {
  const latest = await getLatest();
  new Canvas({
    url,
    version: latest.version + 1,
  }).save();
}

module.exports = {
  save,
  getLatest,
}
