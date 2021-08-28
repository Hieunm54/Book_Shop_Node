import Product from "../models/product.js";
import Cart from "../models/cart.js";

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
		console.log('id in getProductById ', id);
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
		Cart.getCartData((data) => {
			const cartData = [];
			Product.fetchAll()
				.then((products) => {
					for (let product of products) {
						const cartProduct = data.products.find(
							(p) => p.id === product.id
						);
						if (cartProduct) {
							cartData.push({
								product,
								quantity: cartProduct.quantity,
							});
						}
					}

					res.render("shop/cart", {
						title: "My Cart",
						text: "This is my Cart",
						products: cartData,
						total: data.total,
						path: "/cart",
					});
				})
				.catch((err) => console.log(err));
		});
	};

	// [POST] /cart
	postCart = (req, res, next) => {
		const id = req.body.id;
		console.log("postCart ", id);
		Product.fetchProductById(id)
			.then((product) => {
				Cart.addToCart(id, product.price);
			})
			.catch((error) => {
				throw error;
			});
		res.redirect("/cart");
	};

	// [DELETE] /cart/delete-product
	deleteCartProduct = (req, res) => {
		const id = req.body.id;
		Product.fetchProductById(id)
			.then((product) => {
				Cart.deleteProduct(id, product.price);
				res.redirect("/cart");
			})
			.catch((error) => {
				throw error;
			});
	};

	getOrder = (req, res, next) => {
		res.render("shop/order", {
			title: "My Order",
			text: "This is my Order",
			path: "/order",
		});
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
