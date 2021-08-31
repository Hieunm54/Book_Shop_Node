import { ObjectId } from "bson";
import { getDb } from "../util/database.js";

import Product from "./product.js";

class User {
	constructor(name, avatar, email, cart, id) {
		this.name = name;
		this.avatar = avatar;
		this.email = email;
		this.cart = cart ? cart : { items: [] };
		this._id = id;
		// this.cart.items = cart ? cart : {};
	}

	static fetchAll = () => {
		const db = getDb();
		return db.collection("users").find({}).toArray();
	};

	save = () => {
		const db = getDb();
		return db.collection("users").insertOne(this);
	};

	static findUserById = (id) => {
		const db = getDb();
		return db.collection("users").findOne({ _id: ObjectId(id) });
	};

	addToCart = (product) => {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});

		const cartItems = [...this.cart.items];

		// console.log('cartProductIndex: ',cartProductIndex);
		if (cartProductIndex >= 0) {
			// console.log('da tim thay ', cartProductIndex);
			cartItems[cartProductIndex].quantity++;
		} else {
			cartItems.push({
				productId: ObjectId(product._id),
				quantity: 1,
			});
		}

		const updatedProduct = {
			items: cartItems,
		};
		const db = getDb();
		return db
			.collection("users")
			.updateOne({ _id: this._id }, { $set: { cart: updatedProduct } });
	};

	getUserCart = () => {
		const db = getDb();
		const cartItemId = this.cart.items.map((item) => {
			return item.productId;
		});
		return db
			.collection("products")
			.find({ _id: { $in: cartItemId } })
			.toArray()
			.then((products) => {
				return products.map((p) => {
					return {
						...p,
						quantity: this.cart.items.find(
							(i) => i.productId.toString() === p._id.toString()
						).quantity,
					};
				});
			})
			.catch((err) => console.error(err));
	};

	deleteCartProduct = (id) => {
		const cartItems = this.cart.items.filter((i) => {
			return i.productId.toString() !== id.toString();
		});

		// console.log("cartItems:	", cartItems);
		const newCart = {...this.cart, items: cartItems}
		const db = getDb();
		return db
			.collection("users")
			.updateOne(
				{ 
					_id: ObjectId(this._id) 
				},
				{ 
					$set: {cart: newCart} 
				}
			);
	};
}

export default User;
