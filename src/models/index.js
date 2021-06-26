const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const filebasename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const config = require(`${__dirname}/../config/config.js`)[env];

const db = {};

let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, { ...config, logging: false });

fs.readdirSync(__dirname)
  .filter((file) => {
    const returnFile = file.indexOf(".") !== 0 && file !== filebasename && file.slice(-3) === ".js";
    return returnFile;
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
