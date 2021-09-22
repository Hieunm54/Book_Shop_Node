import express from 'express';
import AdminController from '../controllers/admin-controllers.js';
import {isAuth} from '../middleware/is-auth.js'

const adminController = new AdminController()
const router = express.Router();

router.get('/products',adminController.getAdminProduct);

router.get('/add-product',isAuth,adminController.getAddProduct);
router.post('/add-product',isAuth,adminController.postProduct);

router.get('/edit-product/:id',isAuth,adminController.getEditProduct);
router.put('/edit-product',isAuth,adminController.updateProduct);

router.delete('/delete-product',isAuth,adminController.deleteProduct);

// router.get('/users',adminController.getUsers);
// router.get('/add-user',adminController.getAddUser);
// router.post('/add-user',adminController.postAddUser);


export default router;