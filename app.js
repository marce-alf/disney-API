import express from 'express';
import cors from './middlewares/cors.js';
import multer from 'multer';
import path from 'path';
import { storage, files } from './config/config.js';
import dirname from './utils/dirname.js';
import errHandler from './middlewares/errHandler.js';
import sequelize from './database/connection.js';
import Genero from './models/Genero.js';
import Pelicula from './models/Pelicula.js';
import Personaje from './models/Personaje.js';
import Usuario from './models/Usuario.js';
import authRoutes from './routes/auth.js';
import charRoutes from './routes/character.js';
import movieRoutes from './routes/movie.js';

const port = process.env.PORT || 3000;
const app = express();

Personaje.belongsToMany(Pelicula, {
  through: 'personajes_peliculas',
  foreignKey: 'personajeId',
  otherKey: 'peliculaId',
});

Pelicula.belongsToMany(Personaje, {
  through: 'personajes_peliculas',
  foreignKey: 'peliculaId',
  otherKey: 'personajeId',
});

Pelicula.hasMany(Genero, { foreignKey: 'peliculaId', onDelete: 'CASCADE' });
Genero.belongsTo(Pelicula, { foreignKey: 'peliculaId', onDelete: 'CASCADE' });

app.use(express.json());
app.use(cors);
// expose images
app.use('/characters', express.static(path.join(dirname, 'data/characters')));
app.use('/movies', express.static(path.join(dirname, 'data/movies')));
app.use('/genres', express.static(path.join(dirname, 'data/genres')));
app.use('/images', express.static(path.join(dirname, 'public/images')));
app.use(multer({ storage }).fields(files));
app.use('/auth', authRoutes);
app.use('/characters', charRoutes);
app.use('/movies', movieRoutes);
app.use(errHandler);

try {
  await sequelize.authenticate();
  console.log('Connection to database has been established successfully.');
  await sequelize.sync();
  app.listen(port, () => console.log(`Server started on port: ${port}`));
} catch (err) {
  throw err;
}
