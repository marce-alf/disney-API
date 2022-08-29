import express from 'express';
import charController from '../controllers/character.js';
import isAuth from '../middlewares/isAuth.js';
const router = express.Router();

router.get('/', isAuth, charController.getCharacters);
router.get('/:id', isAuth, charController.getCharacters);
router.post('/create-character', isAuth, charController.postCharacter);
router.put('/character-movie', isAuth, charController.putLinkCharacterMovie);
router.put('/update/:id', isAuth, charController.postCharacter);
router.delete('/:id', isAuth, charController.deleteCharacter);

export default router;
