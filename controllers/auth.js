import Usuario from '../models/Usuario.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { jwtsecret } from '../config/config.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: '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',
    },
  })
);

export default {
  async putRegister(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        const err = new Error('Por favor introduzca un email valido!');
        err.status = 422;
        throw err;
      }
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        const err = new Error('Usuario ya existe!');
        err.status = 422;
        throw err;
      }
      if (!validator.isLength(password, { min: 5 })) {
        const err = new Error('El password debe tener al menos 5 caracteres!');
        err.status = 422;
        throw err;
      }
      const encryptedPass = await bcrypt.hash(password, 12);
      const { dataValues: user } = await Usuario.create({ email, password: encryptedPass });
      await transporter.sendMail({
        to: email,
        from: 'disneyapi11@gmail.com',
        subject: 'Signup succeded',
        html: `<h1>Hola ${email}, bienvenido al mundo de disney! 😁.</h1>`,
      });
      res.status(201).json({ message: 'Usuario creado con exito!', user });
    } catch (err) {
      next(err);
    }
  },

  async postLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        const err = new Error('Por favor introduzca un email valido!');
        err.status = 422;
        throw err;
      }
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        const err = new Error('Usuario no encontrado!');
        err.status = 422;
        throw err;
      }
      const isValidPass = await bcrypt.compare(password, user.password);
      if (!isValidPass) {
        const err = new Error('Email o password incorrecto!');
        err.status = 422;
        throw err;
      }
      const token = jwt.sign({ id: user.id, email: user.email }, jwtsecret, {
        expiresIn: '1h',
      });
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },
};
