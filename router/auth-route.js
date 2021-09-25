import express from "express";
import { body, check } from "express-validator";
import AuthController from "../controllers/auth-controllers.js";

import User from "../models/user.js";
const authController = new AuthController();

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
	"/login",
	body("email", "Invalid email.PLease try again").isEmail(),
    body('password',"Invalid Password.PLease try again").isLength({min:5}).matches(/\d/),
	authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
	"/signup",
	body("email")
		.isEmail()
		.withMessage("Please input valid email address")
		.custom((value) => {
			return User.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password")
		.trim()
		.isLength({ min: 5 })
		.withMessage("Password must be at least 5 chars long")
		.matches(/\d/)
		.withMessage("Password Must contain a number"),
	body("cf_password").trim().custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation does not match password");
		}
		return true;
	}),
	authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

export default router;
