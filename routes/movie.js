import express from 'express';
import movieController from '../controllers/movie.js';
import isAuth from '../middlewares/isAuth.js';
const router = express.Router();

router.get('/', isAuth, movieController.getMovies);
router.get('/:id', isAuth, movieController.getMovies);
router.post('/create-movie', isAuth, movieController.postMovie);
router.post('/create-genre', isAuth, movieController.postGenre);
router.put('/update/:id', isAuth, movieController.postMovie);
router.put('/update-genre/:id', isAuth, movieController.postGenre);
router.delete('/:id', isAuth, movieController.deleteMovie);

export default router;
