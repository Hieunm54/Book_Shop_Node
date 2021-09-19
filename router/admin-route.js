import express from 'express';
// import ProductController from '../controllers/shop-controllers.js';
import AdminController from '../controllers/admin-controllers.js';

const adminController = new AdminController()
// const productController = new ProductController();
const router = express.Router();

router.get('/products',adminController.getAdminProduct);

router.get('/add-product',adminController.getAddProduct);
router.post('/add-product',adminController.postProduct);

router.get('/edit-product/:id',adminController.getEditProduct);
router.put('/edit-product',adminController.updateProduct);

router.delete('/delete-product',adminController.deleteProduct);

// router.get('/users',adminController.getUsers);
// router.get('/add-user',adminController.getAddUser);
// router.post('/add-user',adminController.postAddUser);


export default router;