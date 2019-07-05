const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = User;
