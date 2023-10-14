const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const userDB = sequelize.define('userData', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

module.exports = userDB;