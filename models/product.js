import fs from "fs";
import path from "path";
import dirname from "../util/path.js";
// import ObjectId from 'mongodb'

import Cart from './cart.js';

import {getDb} from '../util/database.js'
import { ObjectId } from "bson";

const p = path.join(dirname, "data", "product.json");

const getProductFromFile = (callback) => {
	fs.readFile(p, (err, data) => {
		if (err) {
			callback([]);
		} else {
			callback(JSON.parse(data));
		}
	});
};

class Product {
	constructor(title, imgUrl, price, description) {
		this.title = title;
		this.imgUrl = imgUrl;
		this.price = price;
		this.description = description;
	}

	// save a product
	save() {
		const db = getDb();
		return db.collection('products').insertOne(this);
	}

	// get all product
	static fetchAll() {
		const db = getDb();
		return db.collection('products')
			.find({})
			.toArray()
			.then(products => {
				return products;
			})
			.catch(err => {
				throw err;
			})
	}

	static fetchProductById(id) {
		const db = getDb();
		return db.collection('products')
				.findOne({_id: ObjectId(id)})
				.then(product => {
					console.log('Fetching product: ' + product);
					return product;
				})
				.catch(err => {
					console.log(err);
				})
	}

	static updateProduct(id, updateProduct) {
		// lay ra product do
		getProductFromFile((data) => {
			const productIndex = data.findIndex((product) => product.id === id);
			if (productIndex === -1) {
				// console.log('update fails: ', productIndex);
				return new Error();
			}

			//update data in cart.json
			if(data[productIndex].price !== updateProduct.price){
				Cart.updateTotalPrice(productIndex,data[productIndex].price, updateProduct.price);
			}
			
			//update lai data
			data[productIndex] = updateProduct;
			const newData = [...data];

			// write lai vao file product.json
			fs.writeFile(p, JSON.stringify(newData), (err) => {
				console.log(err);
			});
		});
	}

	static deleteProduct = (id) =>{
		// get product
		getProductFromFile((data) =>{
			const newData = [...data];
			const deleteProduct = newData.find( p => p.id === id); 
			const newProducts = newData.filter(product => product.id !== id);
			fs.writeFile(p, JSON.stringify(newProducts), (err) => {
				if(!err) {
					Cart.deleteProduct(id,+deleteProduct.price);
				}else{
					console.log(err);
				}
			})
		})


		// write back to json file
	}
}

export default Product;
