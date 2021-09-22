import express from "express";

import AuthController from '../controllers/auth-controllers.js';

const authController = new AuthController();


const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);



export default router