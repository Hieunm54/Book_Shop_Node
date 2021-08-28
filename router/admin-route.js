import express from 'express';
// import ProductController from '../controllers/shop-controllers.js';
import AdminController from '../controllers/admin-controllers.js';

const adminController = new AdminController()
// const productController = new ProductController();
const router = express.Router();

router.get('/add-product',adminController.getAddProduct);
router.post('/add-product',adminController.postProduct);

router.get('/products',adminController.getAdminProduct);

router.get('/edit-product/:id',adminController.getEditProduct);
router.put('/edit-product',adminController.updateProduct);

router.delete('/delete-product',adminController.deleteProduct);

export default router;