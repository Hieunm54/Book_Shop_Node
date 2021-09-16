import Product from "../models/product.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";

class ShopController {
	// [GET] /
	getIndex = (req, res, next) => {
		Product.fetchAll()
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
		Product.fetchAll()
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
		console.log("id in getProductById ", id);
		Product.fetchProductById(id)
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
	getCart = (req, res, next) => {
		const user = req.user;
		user.getUserCart()
			.then((products) => {
				res.render("shop/cart", {
					title: "My Cart",
					text: "This is my Cart",
					products,
					total: 0,
					path: "/cart",
				});
			})
			.catch((err) => {
				throw err;
			});
	};

	// [POST] /cart
	postCart = (req, res, next) => {
		const id = req.body.id;
		const user = req.user;
		Product.fetchProductById(id)
			.then((product) => {
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
		Product.fetchProductById(id)
			.then((product) => {
				// Cart.deleteProduct(id, product.price);
				return req.user
						.deleteCartProduct(id)
						.then(() => res.redirect("/cart"))
						.catch(err=> console.error(err));
			})
			.catch((error) => {
				throw error;
			});
	};

	getOrder = (req, res, next) => {
		req.user.getUserOrder()
			.then((orders) =>{	
				res.render("shop/order", {
					title: "My Order",
					text: "This is the Order from:",
					orders,
					path: "/order",
				});
			})
			.catch(err=> console.error(err));
	};

	addOrder = (req, res, next)=>{
		req.user.addOrder()
			.then(() => res.redirect("/order"))
			.catch(err=> console.error(err));

	}

	getCheckout = (req, res, next) => {
		res.render("shop/checkout", {
			title: "My Checkout",
			text: "This is my Checkout",
			path: "/checkout",
		});
	};
}

export default ShopController;
