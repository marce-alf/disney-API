import { API_URL } from '../config/config.js';
import Pelicula from '../models/Pelicula.js';
import validator from 'validator';
import deleteFile from '../helpers/deleteFile.js';
import { Op, or } from 'sequelize';
import sequelize from '../database/connection.js';
import Genero from '../models/Genero.js';

export default {
  async getMovies(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, genre, order } = req.query;
      if (nombre) {
        const movies = await Pelicula.findAll({ where: { titulo: { [Op.like]: `%${nombre}%` } } });
        if (!movies.length > 0) {
          const err = new Error('No se encontraron peliculas!');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ movies });
      }
      if (genre) {
        const [movies] = await sequelize.query(
          'SELECT pe.* FROM peliculas pe INNER JOIN generos ge ON pe.id = ge.peliculaId WHERE ge.id = ?',
          { replacements: [genre] }
        );
        if (!movies.length > 0) {
          const err = new Error('No se encontraron peliculas!');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ movies });
      }
      if (order) {
        console.log(order);
        const movies = await Pelicula.findAll({ order: [['titulo', order]] });
        if (!movies.length > 0) {
          const err = new Error('No se encontraron peliculas!');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ movies });
      }
      const movies = id ? await Pelicula.findByPk(id) : await Pelicula.findAll();
      res.status(200).json({ movies });
    } catch (err) {
      next(err);
    }
  },

  async postMovie(req, res, next) {
    try {
      const { titulo, fechaCreacion, calificacion } = req.body;
      const { id } = req.params;
      const { edit } = req.query;
      const { movieImage } = req.files;
      const imagen = movieImage && movieImage[0].path.replace('data\\', API_URL);
      if (validator.isEmpty(titulo)) {
        const err = new Error('Por favor digite el titulo de la pelicula!');
        err.status = 422;
        throw err;
      }
      if (!validator.isDate(fechaCreacion)) {
        const err = new Error('Por favor seleccione una fecha valida!');
        err.status = 422;
        throw err;
      }
      if (!validator.isNumeric(calificacion)) {
        const err = new Error('La calificacion debe ser numerica!');
        err.status = 422;
        throw err;
      }
      if (calificacion < 1 || calificacion > 5) {
        const err = new Error('Calificacion de ser del 1 al 5.');
        err.status = 422;
        throw err;
      }
      if (id && edit === 'true') {
        const movie = await Pelicula.findByPk(id);
        if (!movie) {
          const err = new Error('Pelicula no encontrada!');
          err.status = 404;
          throw err;
        }
        movie.set({
          imagen: (() => {
            if (!imagen) return character.imagen;
            deleteFile(character.imagen);
            return imagen;
          })(),
          titulo,
          fechaCreacion,
          calificacion,
        });
        await movie.save();
        return res.status(200).json({ message: 'Pelicula actualizada con exito!', movie });
      }
      const movie = await Pelicula.create({ imagen, titulo, fechaCreacion, calificacion });
      res.status(201).json({ message: 'Pelicula creada con exito!', movie });
    } catch (err) {
      deleteFile(req.files.movieImage?.at(0).path);
      next(err);
    }
  },

  async deleteMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await Pelicula.findByPk(id);
      if (!movie) {
        const err = new Error('Pelicula no encontrada!');
        err.status = 404;
        throw err;
      }
      deleteFile(movie.imagen);
      await movie.destroy();
    } catch (err) {
      next(err);
    }
  },

  async postGenre(req, res, next) {
    try {
      const { movieId, nombre } = req.body;
      const { id } = req.params;
      const { edit } = req.query;
      if (validator.isEmpty(nombre)) {
        const err = new Error('Por favor digite el nombre!');
        err.status = 422;
        throw err;
      }
      const { genImage } = req.files;
      const imagen = genImage && genImage[0].replace('//data', API_URL);
      if (id && edit === 'true') {
        const genre = await Genero.findByPk(id);
        if (!genre) {
          const err = new Error('No se encontro el genero!');
          err.status = 404;
          throw err;
        }
        genre.set({
          imagen: (() => {
            if (!imagen) return genre.imagen;
            deleteFile(genre.imagen);
            return imagen;
          })(),
          nombre,
        });
        await genre.save();
        return res.status(200).json({ message: 'Genero actualizado con exito!' });
      }
      const movie = await Pelicula.findByPk(movieId);
      if (!movie) {
        const err = new Error('No se encontro la pelicula!');
        err.status = 404;
        throw err;
      }
      movie.createGenero({ nombre, imagen });
      res.status(201).json({ message: 'Genero creado con exito!' });
    } catch (err) {
      deleteFile(req.files.genreImage?.at(0).path);
      next(err);
    }
  },
};
