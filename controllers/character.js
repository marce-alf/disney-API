import Personaje from '../models/Personaje.js';
import deleteFile from '../helpers/deleteFile.js';
import { API_URL } from '../config/config.js';
import validator from 'validator';
import { Op } from 'sequelize';
import Pelicula from '../models/Pelicula.js';
import sequelize from '../database/connection.js';

export default {
  async getCharacters(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, edad, movies } = req.query;
      console.log(nombre, edad, movies);
      if (nombre) {
        const characters = await Personaje.findAll({
          where: { nombre: { [Op.like]: `%${nombre}%` } },
        });
        if (!characters.length > 0) {
          const err = new Error('No se encontraron personajes');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ characters });
      }
      if (edad) {
        const characters = await Personaje.findAll({ where: { [Op.like]: `%${edad}%` } });
        if (!characters.length > 0) {
          const err = new Error('No se encontraron personajes');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ characters });
      }
      if (movies) {
        const [characters, metadata] = await sequelize.query(
          `SELECT p.*
        FROM personajes p
        INNER JOIN personajes_peliculas pp
        ON p.id = pp.personajeId
        INNER JOIN peliculas pe
        ON pe.id = pp.peliculaId
        WHERE pe.id = ?;`,
          { replacements: [movies] }
        );
        if (!characters.length > 0) {
          const err = new Error('No se encontraron personajes');
          err.status = 404;
          throw err;
        }
        return res.status(200).json({ characters });
      }

      const characters = id
        ? await Personaje.findByPk(id, { include: Pelicula })
        : await Personaje.findAll();
      res.status(200).json({ characters });
    } catch (err) {
      next(err);
    }
  },

  async postCharacter(req, res, next) {
    try {
      const { nombre, edad, peso, historia } = req.body;
      if (
        validator.isEmpty(nombre) ||
        validator.isEmpty(edad) ||
        validator.isEmpty(peso) ||
        validator.isEmpty(historia)
      ) {
        const err = new Error('Hay uno o mas campos vacios!');
        err.status = 422;
        throw err;
      }
      if (!validator.isNumeric(edad)) {
        const err = new Error('Edad debe ser numerico!');
        err.status = 422;
        throw err;
      }
      const { id } = req.params;
      const { edit } = req.query;
      const { characterImage } = req.files;
      const imagen = characterImage && characterImage[0].path.replace('data\\', API_URL);
      if (id && edit === 'true') {
        const character = await Personaje.findByPk(id);
        character.set({
          imagen: (() => {
            if (!imagen) return character.imagen;
            deleteFile(character.imagen);
            return imagen;
          })(),
          nombre,
          edad,
          peso,
          historia,
        });
        await character.save();
        return res.status(200).json({ message: 'Personaje actualizado con exito!', character });
      }
      const { dataValues: character } = await Personaje.create({
        imagen,
        nombre,
        edad,
        peso,
        historia,
      });
      res.status(201).json({ message: 'Personaje creado con exito!', character });
    } catch (err) {
      deleteFile(req.files.characterImage?.at(0).path);
      next(err);
    }
  },

  async deleteCharacter(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const character = await Personaje.findByPk(id);
      deleteFile(character.imagen);
      await character.destroy();
      res.status(200).json({ message: 'Personaje borrado con exito!' });
    } catch (err) {
      next(err);
    }
  },

  async putLinkCharacterMovie(req, res, next) {
    try {
      const { charId, movieId } = req.body;
      const character = await Personaje.findByPk(charId);
      const [characterMovie] = await character.getPeliculas({ where: { id: movieId } });
      if (characterMovie) {
        const err = new Error('Este personaje ya esta en esta pelicula!');
        err.status = 422;
        throw err;
      }
      await character.addPelicula(movieId);
      res.status(200).json({ message: 'Se ha registrado el personaje con la pelicula' });
    } catch (err) {
      next(err);
    }
  },
};
