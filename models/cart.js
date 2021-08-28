import fs from "fs";
import path from "path";
import dirname from "../util/path.js";

import Product from './product.js'
const p = path.join(dirname, "data", "cart.json");

const getDataFromFile = (callback) => {
	fs.readFile(p, (err, data) => {
		if (err) {
			callback([]);
		} else {
			callback(JSON.parse(data));
		}
	});
};

class Cart {
	static addToCart = (id, productPrice) => {
		// initialize cart
		fs.readFile(p, (err, data) => {
			let cart = { products: [], total: 0 };
			if (!err) {
				cart = JSON.parse(data);
			}
			// update cart
			const productIdIndex = cart.products.findIndex(
				(item) => item.id === id
			);
			const existingProduct = cart.products[productIdIndex];

			let updatedProduct;

			if (existingProduct) {
				// const newQuantity = existingProduct.quantity+1;
				updatedProduct = { ...existingProduct };
				updatedProduct.quantity += 1;
				cart.products = [...cart.products];
				cart.products[productIdIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, quantity: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			// cart = {...cart};
			cart.total = (+cart.total + +productPrice).toFixed(2);

			// write file with updated cart
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	};

	static updateTotalPrice = (productIndex, oldPrice, updatePrice) => {
		getDataFromFile((data) => {
			if(!data.products[productIndex]){
				return;
			}
			const quantity = data.products[productIndex].quantity;
			
			data.total = (
				+data.total +
				(updatePrice - oldPrice) * quantity
			).toFixed(2);

			fs.writeFile(p, JSON.stringify(data), (err) => {
				console.log(err);
			});
		});
	};

	static deleteProduct = (id,price) => {
		getDataFromFile(data =>{
			const newData = {...data};
			const productIndex = newData.products.findIndex(p => p.id === id);
			if( productIndex < 0 ){
				return;
			}
			const quantity = newData.products[productIndex].quantity;

			newData.products.splice(productIndex,1);
			newData.total = +newData.total - (+quantity*price);

			fs.writeFile(p, JSON.stringify(newData), (err) =>{
				console.log(err);
			})

		})
	};

	static getCartData = (callback) =>{
		getDataFromFile((data) => callback(data));
	}
}

export default Cart;
