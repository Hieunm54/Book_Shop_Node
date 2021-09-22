import bcrypt from "bcrypt";

import User from "../models/user.js";

// config bcrypt
const sandRounds = 10;

class AuthController {
	//[GET] /login
	getLogin = (req, res) => {
		res.render("auth/login", {
			title: "Login",
			path: "/login",
			authenticated: req.session.isLoggedIn,
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
						return res.redirect("/login");
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
		res.render("auth/signup", {
			title: "Signup",
			path: "/signup",
			authenticated: req.session.isLoggedIn,
		});
	};

	// [POST] /signup
	postSignup = (req, res, next) => {
		const { name, email, password, cf_password } = req.body;
		// console.log(name, email, password, cf_password);
		User.findOne({ email: email })
			.then((user) => {
				if (user) {
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
						res.redirect("/login");
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
