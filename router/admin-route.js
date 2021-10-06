import express from "express";
import AdminController from "../controllers/admin-controllers.js";
import { isAuth } from "../middleware/is-auth.js";
import { body } from "express-validator";

const adminController = new AdminController();
const router = express.Router();

router.get("/products", adminController.getAdminProduct);

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
	"/add-product",
	isAuth,
	body("title", "No special character allowed in the title")
		.trim()
		.isString(),
	body("price", "PLease input a valid number for price").isFloat(),
	body(
		"description",
		"Description should be at least 5 characters long and at max 500 characters"
	)
		.trim()
		.isLength({ min: 5, max: 500 }),
	adminController.postProduct
);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);
router.put(
	"/edit-product",
	isAuth,
	body("title", "No special character allowed in the title")
		.trim()
		.isString(),
	body("price", "PLease input a valid number for price").isFloat(),
	body(
		"description",
		"Description should be at least 5 characters long and at max 500 characters"
	)
		.trim()
		.isLength({ min: 5, max: 500 }),
	isAuth,
	adminController.updateProduct
);

router.delete("/delete-product/:id", isAuth, adminController.deleteProduct);

// router.get('/users',adminController.getUsers);
// router.get('/add-user',adminController.getAddUser);
// router.post('/add-user',adminController.postAddUser);

export default router;
