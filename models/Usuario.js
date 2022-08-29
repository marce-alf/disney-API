import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Usuario = sequelize.define('Usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Usuario;
