import express from 'express';
import authController from '../controllers/auth.js';
const router = express.Router();

router.post('/login', authController.postLogin);
router.put('/register', authController.putRegister);

export default router;
