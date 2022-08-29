import multer from 'multer';
import { v4 } from 'uuid';

export const jwtsecret = 'unsecretosupersecreto';
export const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname.includes('characterImage')) {
      cb(null, 'data/characters');
    }
    if (file.fieldname.includes('movieImage')) {
      cb(null, 'data/movies');
    }
    if (file.fieldname.includes('genreImage')) {
      cb(null, 'data/genres');
    }
  },
  filename(req, file, cb) {
    cb(null, `${v4()}.${file.originalname.split('.')[1]}`);
  },
});
export const fileFilter = (req, file, cb) => {};
export const files = [{ name: 'characterImage' }, { name: 'movieImage' }, { name: 'genreImage' }];
export const API_URL = 'http://localhost:3000/';
