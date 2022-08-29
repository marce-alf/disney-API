import { Sequelize, DataTypes } from 'sequelize';
import { API_URL } from '../config/config.js';
import sequelize from '../database/connection.js';

const Pelicula = sequelize.define('peliculas', {
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
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaCreacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  calificacion: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Pelicula;
