import express from 'express';
import ShopController from '../controllers/shop-controllers.js'
import {isAuth} from '../middleware/is-auth.js'

const shopController = new ShopController();

// const cartController = new CartController();

const router = express.Router();

router.get('/products/:id', shopController.getProductById);
router.get('/products', shopController.getAllProducts);

router.get('/cart',isAuth, shopController.getCart);
router.post('/cart',isAuth, shopController.postCart);
router.delete('/cart/delete-product',isAuth, shopController.deleteCartProduct);

router.get('/order',isAuth, shopController.getOrder);
router.post('/create-order',isAuth, shopController.addOrder);

// router.get('/checkout', shopController.getCheckout);

router.get('/',shopController.getIndex);

export default router;