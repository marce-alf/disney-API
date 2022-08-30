import jwt from 'jsonwebtoken';
import { jwtsecret } from '../config/config.js';

export default (req, _, next) => {
  try {
    const header = req.get('Authorization');
    if (!header) {
      const err = new Error('Could not get auth header. Not authenticated!');
      err.status = 401;
      throw err;
    }
    const token = header.split(' ')[1];
    if (token?.includes('null')) {
      const err = new Error('Could not get a valid token. Not authenticated!');
      err.status = 401;
      throw err;
    }
    const decodedToken = jwt.verify(token, jwtsecret);
    req.userId = decodedToken.id;
    next();
  } catch (err) {
    throw err;
  }
};
