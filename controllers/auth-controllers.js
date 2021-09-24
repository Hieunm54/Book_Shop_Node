import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv'

import User from "../models/user.js";

//config dotenv
dotenv.config();

//create mailer
let mailer = nodemailer.createTransport(sgTransport({
	auth:{
		api_key: process.env.SENDGRID_API_KEY
	}
}))
// config bcrypt
const sandRounds = 10;

class AuthController {
	//[GET] /login
	getLogin = (req, res) => {
		let errMessage = req.flash('error');
		if( errMessage.length <= 0){
			errMessage = null
		}

		let successMessage = req.flash('success');
		if( successMessage.length <= 0){
			successMessage = null
		}
		// console.log('successMessage',successMessage);

		console.log('errMessage:',errMessage);
		res.render("auth/login", {
			title: "Login",
			path: "/login",
			errorMessage: errMessage,
			successMessage
			// authenticated: req.session.isLoggedIn,
		});
	};

	// [POST] /login
	postLogin = (req, res, next) => {
		// res.cookie('isLoggedIn', true);
		const { email, password } = req.body;
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return res.redirect("/login");
				}
				bcrypt.compare(password, user.password).then((result) => {
					if (result == true) {
						req.session.user = user;
						req.session.isLoggedIn = true;
						return req.session.save(() => {
							res.redirect("/");
						});
					} else {
						req.flash('error','Invalid user or password');
						return req.session.save(err=>{
							res.redirect("/login");
						});
					}
				});
			})
			.catch((err) => console.error(err));

		// User.findById("61459f3c7e97d87531157435")
		// 	.then((user) => {
		// 		req.session.user = user;
		// 		req.session.isLoggedIn = true;
		// 		req.session.save(() => res.redirect("/"));
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	};

	// [POST] /logout
	postLogout = (req, res) => {
		req.session.destroy((err) => {
			res.redirect("/");
		});
	};

	// [GET] /signup
	getSignup = (req, res) => {
		let errMessage = req.flash('signupError');
		if( errMessage.length <= 0){
			errMessage = null
		}

		let successMessage = req.flash('success');
		if( successMessage.length <= 0){
			successMessage = null
		}
		console.log('successMessage',successMessage);

		res.render("auth/signup", {
			title: "Signup",
			path: "/signup",
			errMessage,
			// authenticated: req.session.isLoggedIn,
		});
	};

	// [POST] /signup
	postSignup = (req, res, next) => {
		const { name, email, password, cf_password } = req.body;
		// console.log(name, email, password, cf_password);
		User.findOne({ email: email })
			.then((user) => {
				if (user) {
					req.flash('signupError','Invalid gmail or password. Please try again.');
					return res.redirect("/signup");
				}
				// encryp password
				return bcrypt
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
							subject: 'Thank for your signup',
							text: 'Welcome to our shop',
							html: '<b>Hope you enjoy it</b>'
						}
						mailer.sendMail(verifyEmail,(err,result)=>{
							if(err) {
								console.log(err);
								return;
							}else{
								req.flash('success','Signup successful. Please login to continue');
								res.redirect("/login");
							}
						})
					});
			})
			.catch((err) => console.log(err));
	};

	// 	// [POST] /signup
	// 	postSignup = (req, res, next) => {
	// 		const { name, email, password, cf_password } = req.body;
	// 		// console.log(name, email, password, cf_password);
	// 		User.findOne({ email: email })
	// 			.then((user) => {
	// 				if (user) return res.redirect("/signup");
	// 				// encryp password
	// 				return bcrypt
	// 					.hash(password, sandRounds)
	// 					.then((hashPassword) => {
	// 						const newUser = new User({
	// 							name,
	// 							email,
	// 							password: hashPassword,
	// 							cart: { items: [] },
	// 						});
	// 						return newUser.save();
	// 					})
	// 					.then(()=> res.redirect('/login'));
	// 			})
	// 			.catch((err) => console.log(err));
	// 	};
	// }
}
export default AuthController;
