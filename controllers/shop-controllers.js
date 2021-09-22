import Product from "../models/product.js";

const notLoginRedirect = (user, res) => {
	if (!user) res.redirect("/login");
};

class ShopController {
	// [GET] /
	getIndex = (req, res, next) => {
		Product.find({})
			.then((products) => {
				res.render("shop/index", {
					title: "My Shop",
					text: "Welcome to our shop",
					products: products,
					path: "/",
					authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [GET] /products
	getAllProducts = (req, res, next) => {
		Product.find({})
			.then((products) => {
				res.render("shop/product-list", {
					title: "All Products",
					products: products,
					path: "/products",
					authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				throw err;
			});
	};

	// [GET] /products/:id
	getProductById = (req, res, next) => {
		const id = req.params.id;
		Product.findById(id)
			.then((product) => {
				res.render("shop/product-details", {
					title: "My Details Product",
					product,
					path: "/products",
					authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				throw err;
			});
	};

	// [GET] /cart
	getCart = async (req, res, next) => {
		const user = req.user;
		//if user is not login => redirect to login page
		notLoginRedirect(user, res);
		await user
			.populate("cart.items.productId")
			.then((products) => {
				// console.log('get cart: ', products.cart.items);
				res.render("shop/cart", {
					title: "My Cart",
					text: "This is my Cart",
					products: products.cart.items,
					total: 0,
					path: "/cart",
					authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => {
				throw err;
			});

		// user.getUserCart()
		// 	.then((products) => {
		// 		console.log('Product in cart', products);
		// 		res.render("shop/cart", {
		// 			title: "My Cart",
		// 			text: "This is my Cart",
		// 			products,
		// 			total: 0,
		// 			path: "/cart",
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		throw err;
		// 	});
	};

	// [POST] /cart
	postCart = (req, res, next) => {
		const id = req.body.id;
		const user = req.user;
		//if user is not login => redirect to login page
		notLoginRedirect(user, res);
		Product.findById(id)
			.populate("userId", "name")
			.then((product) => {
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
		notLoginRedirect(req.user,res);
		req.user
			.deleteCartProduct(id)
			.then(() => res.redirect("/cart"))
			.catch((err) => console.error(err));
	};

	getOrder = (req, res, next) => {
		//if user is not login => redirect to login page
		notLoginRedirect(req.user,res);
		req.user
			.getUserOrder()
			.then((orders) => {
				res.render("shop/order", {
					title: "My Order",
					text: "This is the Order from:",
					orders: orders,
					path: "/order",
					authenticated: req.session.isLoggedIn,
				});
			})
			.catch((err) => console.error(err));
	};

	addOrder = (req, res, next) => {
		//if user is not login => redirect to login page
		notLoginRedirect(req.user,res);
		req.user
			.addOrder()
			.then(() => res.redirect("/order"))
			.catch((err) => console.error(err));
	};

	getCheckout = (req, res, next) => {
		res.render("shop/checkout", {
			title: "My Checkout",
			text: "This is my Checkout",
			path: "/checkout",
			authenticated: req.session.isLoggedIn,
		});
	};
}

export default ShopController;
