import { Sequelize, DataTypes } from 'sequelize';
import { API_URL } from '../config/config.js';
import sequelize from '../database/connection.js';

const Personaje = sequelize.define('personajes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: `${API_URL}images/default.png`,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  historia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Personaje;
