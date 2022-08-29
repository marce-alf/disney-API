import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('DATABASE', 'USER', 'PASS', {
  host: '',
  dialect: 'mysql',
});

export default sequelize;
