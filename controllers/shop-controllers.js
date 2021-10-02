import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Product from "../models/product.js";
import Order from "../models/order.js";

const ITEMS_PER_PAGE = 2;

class ShopController {
	// [GET] /
	getIndex = (req, res, next) => {
		const page = +req.query.page || 1;
		// auto generate page number
		let totalDocs;
		Product.countDocuments({})
			.then((numDocuments) => {
				totalDocs = numDocuments;
				return Product.find({})
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE);
			})
			.then((products) => {
				let maxPage = Math.ceil(totalDocs / ITEMS_PER_PAGE);

				return res.render("shop/index", {
					title: "My Shop",
					text: "Welcome to our shop",
					products: products,
					numberDocs: maxPage,
					path: "/",
					currentPage: page,
					hasNextPage: ITEMS_PER_PAGE * page < totalDocs,
					hasPrevPage: page > 1,
					nextPage: page + 1,
					prevPage: page - 1,
					lastPage: maxPage,

					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [GET] /products
	getAllProducts = (req, res, next) => {
		const page = +req.query.page || 1;
		// auto generate page number
		let totalDocs;
		Product.countDocuments({})
			.then((numDocuments) => {
				totalDocs = numDocuments;
				return Product.find({})
					.skip((page - 1) * ITEMS_PER_PAGE)
					.limit(ITEMS_PER_PAGE);
			})
			.then((products) => {
				let maxPage = Math.ceil(totalDocs / ITEMS_PER_PAGE);

				return res.render("shop/product-list", {
					title: "My Shop",
					text: "Welcome to our shop",
					products: products,
					numberDocs: maxPage,
					path: "/",
					currentPage: page,
					hasNextPage: ITEMS_PER_PAGE * page < totalDocs,
					hasPrevPage: page > 1,
					nextPage: page + 1,
					prevPage: page - 1,
					lastPage: maxPage,

					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [GET] /products/:id
	getProductById = (req, res, next) => {
		const id = req.params.id;
		Product.findById(id)
			.then((product) => {
				console.log("Product: ", product);

				res.render("shop/product-details", {
					title: "My Details Product",
					product,
					path: "",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	// [GET] /cart
	getCart = async (req, res, next) => {
		const user = req.user;
		//if user is not login => redirect to login page
		await user
			.populate("cart.items.productId")
			.then((products) => {
				return res.render("shop/cart", {
					title: "My Cart",
					text: "This is my Cart",
					products: products.cart.items,
					total: 0,
					path: "/cart",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				// const error = new Error(err);
				// error.httpStatusCode = 500;
				// return next(error);
			});
	};

	// [POST] /cart
	postCart = (req, res, next) => {
		const id = req.body.id;
		const user = req.user;
		//if user is not login => redirect to login page
		Product.findById(id)
			.populate("userId", "name")
			.then((product) => {
				// console.log("Error when add to cart");
				// console.log("user name: ", product.userId.name);
				return user.addToCart(product);
			})
			.then((result) => {
				// console.log('addtocart: ',result.cart.items);
				res.redirect("/cart");
			});
	};

	// [DELETE] /cart/delete-product
	deleteCartProduct = (req, res) => {
		const id = req.body.id;
		//if user is not login => redirect to login page
		req.user
			.deleteCartProduct(id)
			.then(() => {
				return res.redirect("/cart");
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	getOrder = (req, res, next) => {
		//if user is not login => redirect to login page
		req.user
			.getUserOrder()
			.then((orders) => {
				res.render("shop/order", {
					title: "My Order",
					text: "This is the Order from:",
					orders: orders,
					path: "/order",
					// authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	addOrder = (req, res, next) => {
		//if user is not login => redirect to login page
		req.user
			.addOrder()
			.then(() => res.redirect("/order"))
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	};

	getInvoice = (req, res, next) => {
		const orderId = req.params.orderId;

		Order.findById(orderId)
			.then((order) => {
				// console.log("Order:", order);
				if (!order) {
					return next(
						new Error("No order found. PLease check again")
					);
				}

				//check if an user attempt to download order that not belongs to him.
				if (order.user.userId.toString() !== req.user._id.toString()) {
					return next(new Error("UNAUTHORIZED!"));
				}

				const invoiceName = "invoice" + "-" + orderId + ".pdf";
				const invoicePath = path.join("data/invoices", invoiceName);

				// generate pdf invoice file
				const doc = new PDFDocument();

				res.setHeader("Content-Type", "application/pdf");
				res.setHeader(
					"Content-Disposition",
					'attachment; filename="' + invoiceName + '"'
				);

				doc.pipe(fs.createWriteStream(invoicePath)); // write to pdf
				doc.pipe(res); // http response

				doc.fontSize(24).fillColor("green").text("INVOICE");
				doc.fontSize(18).text("The invoice from " + order.user.email);

				doc.text("-------------------------");
				let total = 0;
				for (let product of order.productList) {
					total += product.price * product.quantity;
					doc.fontSize(18).text(
						product.title +
							"-" +
							product.quantity +
							"*" +
							product.price +
							"$"
					);
				}
				doc.text("-------------------------");
				doc.fontSize(20)
					.fillColor("red")
					.text("Total Price: " + total);

				doc.end();

				// return fs.readFile(invoicePath, (err, data) => {
				// 	if (err) {
				// 		return next(err);
				// 	}

				// 	const file = fs.createReadStream(invoicePath);
				// 	res.setHeader("Content-Type", "application/pdf");
				// 	res.setHeader(
				// 		"Content-Disposition",
				// 		'attachment; filename="' + invoiceName + '"'
				// 	);
				// 	file.pipe(res);
				// });
			})
			.catch((err) => next(err));
		// console.log('orderId: ' + orderId);
	};

	getCheckout = (req, res, next) => {
		res.render("shop/checkout", {
			title: "My Checkout",
			text: "This is my Checkout",
			path: "/checkout",
			// authenticated: req.session.isLoggedIn,
		});
	};
}

export default ShopController;
