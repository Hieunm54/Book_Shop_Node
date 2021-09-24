import express from "express";

import AuthController from '../controllers/auth-controllers.js';

const authController = new AuthController();


const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);






export default router