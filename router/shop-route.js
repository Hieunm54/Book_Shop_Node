import express from 'express';
import ShopController from '../controllers/shop-controllers.js'


const shopController = new ShopController();

// const cartController = new CartController();

const router = express.Router();

router.get('/products/:id', shopController.getProductById);
router.get('/products', shopController.getAllProducts);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.delete('/cart/delete-product', shopController.deleteCartProduct);

router.get('/order', shopController.getOrder);
router.post('/create-order', shopController.addOrder);

router.get('/checkout', shopController.getCheckout);

router.get('/',shopController.getIndex);

export default router;