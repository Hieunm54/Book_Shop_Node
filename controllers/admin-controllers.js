import mongoose from "mongoose";
import Product from "../models/product.js";
import { validationResult } from "express-validator";

import { deleteFile } from "../util/file.js";

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
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
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
		const { title, price, description } = req.body;
		const image = req.file;
		if (!image) {
			return res.status(422).render("admin/add-product", {
				title: "Shop",
				path: "/admin/add-product",
				errorValidation: "Attach file is not an image",
			});
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log('error when add new product',errors)
			return res.status(422).render("admin/add-product", {
				title: "Shop",
				path: "/admin/add-product",
				errorValidation: errors.array()[0].msg,
			});
		}

		const imgUrl = image.path;

		// console.log('req.file: ',req.file);
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
				return res.redirect("/");
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);

				// console.log(err);
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
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [PUT] /admin/edit-product
	updateProduct = (req, res, next) => {
		// const id = req.body.id;
		const { id, title, price, description } = req.body;
		const image = req.file;
		// console.log('image: ', image);

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log('error when add new product',errors)
			return res.status(422).render("admin/edit-product", {
				title: "Edit Page",
				product: {
					title,
					imgUrl: image.path,
					price,
					description,
					_id: id,
				},
				path: "/admin/edit-product",
				errorValidation: errors.array()[0].msg,
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
				if (image) {
					deleteFile(product.imgUrl);
					product.imgUrl = image.path;
				}
				product.description = description;

				return product.save().then(() => {
					res.redirect("/admin/products");
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
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
		const id = req.params.id;
		console.log("delete id: " + id);

		// const imgUrl = req.body.imgUrl;
		Product.findById(id)
			.then((product) => {
				if (!product) {
					return next(
						new Error(
							"Some error happend when deleting this product.Please try again."
						)
					);
				}
				const imgUrl = product.imgUrl;
				deleteFile(imgUrl);
				return Product.deleteOne({ _id: id, userId: req.user._id });
			})
			.then(() => {
				console.log("delete successfully");
				res.status(200).json({message:'Success!'});
			})
			.catch((err) => {
				res.status(500).json({ err: err });
				// const error = new Error(err);
				// error.httpStatusCode = 500;
				// return next(error);
			});

		// Product.deleteOne({ _id: id, userId: req.user._id })
		// 	.then(()=>{
		// 		res.redirect("/admin/products");
		// 	})
		// 	.catch((err) => {
		// 		const error = new Error(err);
		// 		error.httpStatusCode = 500;
		// 		return next(error);
		// 	});
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
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
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
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};
}

export default AdminController;
