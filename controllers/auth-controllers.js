import User from "../models/user.js";

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
		User.findById("61459f3c7e97d87531157435")
			.then((user) => {
				req.session.user = user;
				req.session.isLoggedIn = true;
                req.session.save(()=> res.redirect("/"));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [POST] /logout
	postLogout = (req, res) => {
		req.session.destroy((err) => {
			res.redirect("/");
		});
	};
}

export default AuthController;
