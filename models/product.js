import fs from "fs";
import path from "path";
import dirname from "../util/path.js";
// import ObjectId from 'mongodb'


import { getDb } from "../util/database.js";
import { ObjectId } from "bson";


class Product {
	constructor(title, imgUrl, price, description,id,userId) {
		this.title = title;
		this.imgUrl = imgUrl;
		this.price = price;
		this.description = description;
		this._id = id ? ObjectId(id): null;
		this.userId = userId;
	}

	// save a product
	save() {
		const db = getDb();
		return db.collection("products").insertOne(this);
	}

	// get all product
	static fetchAll() {
		const db = getDb();
		return db
			.collection("products")
			.find({})
			.toArray()
			.then((products) => {
				return products;
			})
			.catch((err) => {
				throw err;
			});
	}

	static fetchProductById(id) {
		const db = getDb();
		return db
			.collection("products")
			.findOne({ _id: ObjectId(id) })
			.then((product) => {
				// console.log("Fetching product: " + product);
				return product;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	static updateProduct(id, updateProduct, cb) {
		// lay ra product do
		const db = getDb();
		let query = { _id: ObjectId(id) };
		let newValues = {
			$set: {
				title: updateProduct.title,
				imgUrl: updateProduct.imgUrl,
				price: updateProduct.price,
				description: updateProduct.description,
			},
		};
		db.collection("products")
			.updateOne(query, newValues)
			.then(() => {
				console.log("Update successful");
				cb();
			})
			.catch((err) => {
				console.log(err);
			});

		//update data in cart.json- <de_sau>

		//update lai data

		// getProductFromFile((data) => {
		// 	const productIndex = data.findIndex((product) => product.id === id);
		// 	if (productIndex === -1) {
		// 		// console.log('update fails: ', productIndex);
		// 		return new Error();
		// 	}

		// 	//update data in cart.json
		// 	if(data[productIndex].price !== updateProduct.price){
		// 		Cart.updateTotalPrice(productIndex,data[productIndex].price, updateProduct.price);
		// 	}

		// 	//update lai data
		// 	data[productIndex] = updateProduct;
		// 	const newData = [...data];

		// 	// write lai vao file product.json
		// 	fs.writeFile(p, JSON.stringify(newData), (err) => {
		// 		console.log(err);
		// 	});
		// });
	}

	static deleteProduct = (id, cb) => {
		// get product
		const db = getDb();
		db.collection("products")
			.deleteOne({ _id: ObjectId(id)  })
			.then(() => {
				console.log('Deleted successfully');
				cb();
			})
			.catch((err) => {
				console.log(err);
			});

		// getProductFromFile((data) =>{
		// 	const newData = [...data];
		// 	const deleteProduct = newData.find( p => p.id === id);
		// 	const newProducts = newData.filter(product => product.id !== id);
		// 	fs.writeFile(p, JSON.stringify(newProducts), (err) => {
		// 		if(!err) {
		// 			Cart.deleteProduct(id,+deleteProduct.price);
		// 		}else{
		// 			console.log(err);
		// 		}
		// 	})
		// })

		// write back to json file
	};
}

export default Product;
