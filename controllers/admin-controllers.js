import Product from "../models/product.js";
import Cart from "../models/cart.js";

class AdminController {
	// [GET] /admin/add-product
	getAddProduct = (req, res, next) => {
		res.render("admin/add-product", {
			title: "Shop",
			path: "/admin/add-product",
		});
	};

	// [GET] /admin/products
	getAdminProduct = (req, res, next) => {
		Product.fetchAll()
			.then((products) => {
				res.render("admin/products", {
					title: "My Shop",
					text: "Welcome to our shop",
					products: products,
					path: "/admin/products",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [POST ] /admin/add-product
	postProduct = (req, res, next) => {
		const { title, imgUrl, price, description } = req.body;
		const product = new Product(title, imgUrl, +price, description);
		product
			.save()
			.then((result) => {
				console.log("product add: ", result);
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
		Product.fetchProductById(id)
			.then((product) => {
				res.render("admin/edit-product", {
					title: "Edit Page",
					product,
					path: "/admin/edit-product",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// [PUT] /admin/edit-product
	updateProduct = (req, res, next) => {
		const id = req.body.id;
		const { title, imgUrl, price, description } = req.body;

		Product.updateProduct(
			id,
			{
				_id: id,
				title: title,
				imgUrl: imgUrl,
				price: +price,
				description: description,
			},
			() => {
				res.redirect("/admin/products");
			}
		);
	};

	// [DELETE] /admin/delete-product
	deleteProduct = (req, res, next) => {
		const id = req.body.id;
		// Cart.deleteProduct(id);
		Product.deleteProduct(id, () => {
			res.redirect("/admin/products");
		});
	};
}

export default AdminController;
