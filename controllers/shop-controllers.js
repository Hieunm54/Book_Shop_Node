import Product from "../models/product.js";

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
				});
			})
			.catch((err) => {
				throw err;
			});
	};

	// [GET] /cart
	getCart = async (req, res, next) => {
		const user = req.user;

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
		Product.findById(id)
			.populate("userId", "name")
			.then((product) => {
				console.log("user name: ", product.userId.name);
				return user.addToCart(product);
			})
			.then((result) => {
				console.log(result);
				res.redirect("/cart");
			});
	};

	// [DELETE] /cart/delete-product
	deleteCartProduct = (req, res) => {
		const id = req.body.id;

		req.user
			.deleteCartProduct(id)
			.then(() => res.redirect("/cart"))
			.catch((err) => console.error(err));

		// Product.fetchProductById(id)
		// 	.then((product) => {
		// 		// Cart.deleteProduct(id, product.price);
		// 		return req.user
		// 			.deleteCartProduct(id)
		// 			.then(() => res.redirect("/cart"))
		// 			.catch((err) => console.error(err));
		// 	})
		// 	.catch((error) => {
		// 		throw error;
		// 	});
	};

	getOrder = (req, res, next) => {
		req.user.getUserOrder()
			.then((orders) => {
					console.log('orders ', orders )
				res.render("shop/order", {
					title: "My Order",
					text: "This is the Order from:",
					orders: orders,
					path: "/order",
				});
			})
			.catch((err) => console.error(err));
	};

	addOrder = (req, res, next) => {
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
		});
	};
}

export default ShopController;
