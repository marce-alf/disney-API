import { Sequelize, DataTypes } from 'sequelize';
import { API_URL } from '../config/config.js';
import sequelize from '../database/connection.js';

const Genero = sequelize.define('generos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: `${API_URL}images/default.png`,
  },
});

export default Genero;
