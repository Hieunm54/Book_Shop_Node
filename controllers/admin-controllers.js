import Product from "../models/product.js";
import {validationResult} from 'express-validator';
// import User from "../models/user.js"

class AdminController {

	// [GET] /admin/products
	getAdminProduct = (req, res, next) => {
		Product.find({ userId: req.user._id })
			.then((products) => {
				res.render("admin/products", {
					title: "My Shop",
					text: "Welcome to our shop",
					products: products,
					path: "/admin/products",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [GET] /admin/add-product
	getAddProduct = (req, res, next) => {
		res.render("admin/add-product", {
			title: "Shop",
			path: "/admin/add-product",
			// authenticated: req.session.isLoggedIn,
		});
	};


	// [POST ] /admin/add-product
	postProduct = (req, res, next) => {
		const { title, imgUrl, price, description } = req.body;

		const errors = validationResult(req);
		if( !errors.isEmpty()){
			// console.log('error when add new product',errors)
			return res.status(422).render("admin/add-product", {
				title: "Shop",
				path: "/admin/add-product",
				errorValidation: errors.array()[0].msg
			});
		}

		const product = new Product({
			title: title,
			imgUrl: imgUrl,
			price: price,
			description: description,
			userId: req.user._id,
			// authenticated: req.session.isLoggedIn,
		});
		product
			.save()
			.then((result) => {
				// console.log("product add: ", result);
				res.redirect("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [GET] /admin/edit-product/:id
	getEditProduct = (req, res, next) => {
		const id = req.params.id;
		const editingMode = Boolean(req.query.edit);
		if (!editingMode) {
			return res.redirect("/");
		}
		Product.findById(id)
			.then((product) => {
				res.render("admin/edit-product", {
					title: "Edit Page",
					product,
					path: "/admin/edit-product",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [PUT] /admin/edit-product
	updateProduct = (req, res, next) => {
		// const id = req.body.id;
		const {id, title, imgUrl, price, description } = req.body;

		const errors = validationResult(req);
		if( !errors.isEmpty()){
			console.log('error when add new product',errors)
			return res.status(422).render("admin/edit-product", {
				title: "Edit Page",
				product: { title, imgUrl, price, description,_id:id },
				path: "/admin/edit-product",
				errorValidation: errors.array()[0].msg
				// authenticated: req.session.isLoggedIn,
			});
		}

		Product.findById(req.body.id)
			.then((product) => {
				if (product.userId.toString() !== req.user._id.toString()) {
					return res.redirect("/");
				}
				product.title = title;
				product.price = price;
				product.imgUrl = imgUrl;
				product.description = description;
				console.log("product 2", product);

				return product.save().then(() => {
					res.redirect("/admin/products");
				});
			})
			.catch((err) => {
				console.log(err);
			});

		// Product.findByIdAndUpdate(
		// 	id,
		// 	{
		// 		// _id: id,
		// 		title: title,
		// 		imgUrl: imgUrl,
		// 		price: price,
		// 		description: description,
		// 	},
		// 	{
		// 		runValidators: true,
		// 	},
		// 	() => {
		// 		res.redirect("/admin/products");
		// 	}
		// );

		// (
		// 	id,
		// 	{
		// 		_id: id,
		// 		title: title,
		// 		imgUrl: imgUrl,
		// 		price: +price,
		// 		description: description,
		// 	},
		// 	() => {
		// 		res.redirect("/admin/products");
		// 	}
		// );
	};

	// [DELETE] /admin/delete-product
	deleteProduct = (req, res, next) => {
		const id = req.body.id;
		// Cart.deleteProduct(id);
		Product.deleteOne({ _id: id, userId: req.user._id })
			.then(()=>{
				res.redirect("/admin/products");
			})
			.catch((err) => {
				console.log(err);
			});
		
	};

	// [GET] /admin/users/
	getUsers = (req, res, next) => {
		User.fetchAll()
			.then((users) => {
				res.render("user/users", {
					title: "Users",
					users,
					path: "/admin/users",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				throw err;
			});
	};

	// [GET] /admin/add-users
	getAddUser = (req, res, next) => {
		res.render("user/add-user", { path: "admin/add-user" });
	};

	// [POST] /admin/add-users
	postAddUser = (req, res, next) => {
		const { name, avatar, email } = req.body;
		const newUser = new User(name, avatar, email);
		newUser
			.save()
			.then(() => {
				res.redirect("/admin/users");
			})
			.catch((err) => {
				console.log(err);
			});
	};
}

export default AdminController;
