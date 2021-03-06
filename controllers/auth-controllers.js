import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

import User from "../models/user.js";

//config dotenv
dotenv.config();

//create mailer
let mailer = nodemailer.createTransport(
	sgTransport({
		auth: {
			api_key: process.env.SENDGRID_API_KEY,
		},
	})
);
// config bcrypt
const sandRounds = 10;

class AuthController {
	//[GET] /login
	getLogin = (req, res) => {
		let errMessage = req.flash("error");
		if (errMessage.length <= 0) {
			errMessage = null;
		} else {
			errMessage = errMessage[0];
		}

		let successMessage = req.flash("success");
		if (successMessage.length <= 0) {
			successMessage = null;
		} else {
			successMessage = successMessage[0];
		}
		// console.log('successMessage',successMessage);

		res.render("auth/login", {
			title: "Login",
			path: "/login",
			errorMessage: errMessage,
			successMessage,
			// authenticated: req.session.isLoggedIn,
		});
	};

	// [POST] /login
	postLogin = (req, res, next) => {
		// res.cookie('isLoggedIn', true);
		const { email, password } = req.body;
		const errors = validationResult(req);
		// console.log("err mapped: ", errors.mapped());
		if (!errors.isEmpty()) {
			return res.status(422).render("auth/login", {
				title: "Login",
				path: "/login",
				errorMessage: errors.array()[0].msg,
				validationErrors: errors.mapped(),
				// authenticated: req.session.isLoggedIn,
			});
		}
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return res.status(422).render("auth/login", {
						title: "Login",
						path: "/login",
						errorMessage: "Invalid username or password",
						validationErrors: errors.mapped(),
					});
				}

				bcrypt.compare(password, user.password).then((result) => {
					if (result == true) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save(() => {
							res.redirect("/");
						});
					} else {
						return res.status(422).render("auth/login", {
							title: "Login",
							path: "/login",
							errorMessage: "Invalid username or password",
							validationErrors: errors.mapped(),
							// authenticated: req.session.isLoggedIn,
						});
					
					}
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});


	};

	// [POST] /logout
	postLogout = (req, res) => {
		req.session.destroy((err) => {
			res.redirect("/");
		});
	};

	// [GET] /signup
	getSignup = (req, res) => {
		let errMessage = req.flash("error");
		if (errMessage.length <= 0) {
			errMessage = null;
		} else {
			errMessage = errMessage[0];
		}

		res.render("auth/signup", {
			title: "Signup",
			path: "/signup",
			errMessage,
		});
	};

	// [POST] /signup
	postSignup = (req, res, next) => {
		const { name, email, password, cf_password } = req.body;
		// console.log(name, email, password, cf_password);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors: ", errors.array());

			return res.status(422).render("auth/signup", {
				title: "Signup",
				path: "/signup",
				errMessage: errors.array()[0].msg,
			});
		}

		// encryp password
		bcrypt
			.hash(password, sandRounds)
			.then((hashPassword) => {
				const newUser = new User({
					name,
					email,
					password: hashPassword,
					cart: { items: [] },
				});

				return newUser.save();
			})
			.then(() => {
				const verifyEmail = {
					to: email,
					from: process.env.SENDGRID_SENDER,
					subject: "Thank for your signup",
					text: "Welcome to our shop",
					html: "<b>Hope you enjoy it</b>",
				};
				mailer.sendMail(verifyEmail, (err, result) => {
					if (err) {
						console.log(err);
						return;
					} else {
						req.flash(
							"success",
							"Signup successful. Please login to continue"
						);
						res.redirect("/login");
					}
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [GET /reset
	getReset = (req, res, next) => {
		let errMessage = req.flash("error");
		if (errMessage.length <= 0) {
			errMessage = null;
		} else {
			errMessage = errMessage[0];
		}

		res.render("auth/reset", {
			title: "Reset",
			path: "/reset",
			errMessage,
		});
	};

	// [POST] /reset
	postReset = (req, res, next) => {
		const email = req.body.email;

		crypto.randomBytes(48, (err, buffer) => {
			if (err) {
				console.error(err);
				return res.redirect("/reset");
			}

			const token = buffer.toString("hex");

			User.findOne({ email: email })
				.then((user) => {
					if (!user) {
						req.flash(
							"error",
							"Invalid email address- No account found"
						);
						return res.redirect("/reset");
					}

					user.resetToken = token;
					user.resetTokenExpriredDate = Date.now() + 3600000;

					return user.save().then(() => {
						res.redirect("/login");
						const verifyEmail = {
							to: email,
							from: process.env.SENDGRID_SENDER,
							subject: "Password reset",
							html: `
									<p>You requested a password reset</p>
									<p>Click on this <a href="http://localhost:3000/reset/${token}">LINK <a/> to set a new password </p> 
								`,
						};

						mailer.sendMail(verifyEmail, (err, result) => {
							if (err) {
								console.log(err);
							}
						});
					});
				})
				.catch((err) => {
					const error = new Error(err);
					error.httpStatusCode = 500;
					return next(error);
				});
		});
	};

	// [GET] /auth/reset/:token
	getResetPassword = (req, res, next) => {
		const token = req.params.token;

		User.findOne({
			resetToken: token,
			resetTokenExpriredDate: { $gt: Date.now() },
		})
			.then((user) => {
				let errMessage = req.flash("error");
				if (errMessage.length <= 0) {
					errMessage = null;
				} else {
					errMessage = errMessage[0];
				}

				if (!user) {
					console.log("No User found");
					return res.redirect("/login");
				}

				return res.render("auth/reset-password", {
					title: "Reset Password",
					path: "/reset",
					errMessage,
					userId: user._id,
					passwordToken: token,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [POST] /auth/reset-password
	postResetPassword = (req, res, next) => {
		const { newPassword, userId, passwordToken } = req.body;
		let resetUser;

		User.findOne({
			resetToken: passwordToken,
			resetTokenExpriredDate: { $gt: Date.now() },
			_id: userId,
		})
			.then((user) => {
				if (!user) {
					console.log("No User Found");
					return res.redirect("/login");
				}

				resetUser = user;
				return bcrypt
					.hash(newPassword, 10)
					.then((hashPassword) => {
						resetUser.password = hashPassword;
						resetUser.resetToken = null;
						resetUser.resetTokenExpriredDate = null;
						return resetUser.save();
					})
					.then(() => {
						return res.redirect("/login");
					});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};
}

export default AuthController;
