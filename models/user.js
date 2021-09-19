import mongoose from "mongoose";
import Product from "../models/product.js";

const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

userSchema.methods.addToCart = function (product) {
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
			productId: product._id,
			quantity: 1,
		});
	}

	const updatedProduct = {
		items: cartItems,
	};
	// const db = getDb();
	return mongoose
		.model("User")
		.findByIdAndUpdate(this._id, { $set: { cart: updatedProduct } });
	// return db
	// 	.collection("users")
	// 	.updateOne({ _id: this._id }, { $set: { cart: updatedProduct } });
};

userSchema.methods.getUserCart = async function () {
	const cartItemId = this.cart.items.map((item) => {
		return item.productId;
	});

	try {
		const products = await Product.find({
			_id: { $in: cartItemId },
		}).lean();
		return products.map((p) => {
			return {
				...p,
				quantity: this.cart.items.find(
					(i) => i.productId.toString() === p._id.toString()
				).quantity,
			};
		});
	} catch (err) {
		return console.error(err);
	}
};

userSchema.methods.deleteCartProduct = function(id) {
	//todo ktra quantity cua thang do so vs 1.
	const productIndex = this.cart.items.findIndex(item => item.productId.toString() === id.toString());
	
	let cartItems = [...this.cart.items];

	//todo if quantity >1
	if( cartItems[productIndex].quantity > 1 ){
		cartItems[productIndex].quantity--;	
	} else{
		//todo else
		cartItems = this.cart.items.filter((i) => {
			return i.productId.toString() !== id.toString();
		});
	}

	this.cart.items = cartItems;
	return this.save();
};

export default mongoose.model("User", userSchema);

// import { ObjectId } from "bson";
// import { getDb } from "../util/database.js";

// import Product from "./product.js";

// class User {
// 	constructor(name, avatar, email, cart, id) {
// 		this.name = name;
// 		this.avatar = avatar;
// 		this.email = email;
// 		this.cart = cart ? cart : { items: [] };
// 		this._id = id;
// 		// this.cart.items = cart ? cart : {};
// 	}

// 	static fetchAll = () => {
// 		const db = getDb();
// 		return db.collection("users").find({}).toArray();
// 	};

// 	save = () => {
// 		const db = getDb();
// 		return db.collection("users").insertOne(this);
// 	};

// 	static findUserById = (id) => {
// 		const db = getDb();
// 		return db.collection("users").findOne({ _id: ObjectId(id) });
// 	};

// 	addToCart = (product) => {
// 		const cartProductIndex = this.cart.items.findIndex((cp) => {
// 			return cp.productId.toString() === product._id.toString();
// 		});

// 		const cartItems = [...this.cart.items];

// 		// console.log('cartProductIndex: ',cartProductIndex);
// 		if (cartProductIndex >= 0) {
// 			// console.log('da tim thay ', cartProductIndex);
// 			cartItems[cartProductIndex].quantity++;
// 		} else {
// 			cartItems.push({
// 				productId: ObjectId(product._id),
// 				quantity: 1,
// 			});
// 		}

// 		const updatedProduct = {
// 			items: cartItems,
// 		};
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.updateOne({ _id: this._id }, { $set: { cart: updatedProduct } });
// 	};

// 	addOrder = () => {
// 		const db = getDb();

// 		return this.getUserCart()
// 			.then((orderItems) => {
// 				const order = {
// 					items: orderItems,
// 					user: {
// 						_id: ObjectId(this._id),
// 						name: this.name,
// 					},
// 				};

// 				return db.collection("orders").insertOne(order);
// 			})
// 			.then(() => {
// 				this.cart = { items: [] };
// 				return db
// 					.collection("users")
// 					.updateOne(
// 						{ _id: this._id },
// 						{ $set: { cart: { items: [] } } }
// 					);
// 			});
// 	};

// 	getUserOrder = () => {
// 		const db = getDb();
// 		return db.collection("orders").find({ 'user._id' : this._id }).toArray()
// 				.then(result =>{
// 					return result;
// 				})
// 				.catch(err => console.error(err));
// 	};

// 	getUserCart = () => {
// 		const db = getDb();
// 		const cartItemId = this.cart.items.map((item) => {
// 			return item.productId;
// 		});
// 		return db
// 			.collection("products")
// 			.find({ _id: { $in: cartItemId } })
// 			.toArray()
// 			.then((products) => {
// 				return products.map((p) => {
// 					return {
// 						...p,
// 						quantity: this.cart.items.find(
// 							(i) => i.productId.toString() === p._id.toString()
// 						).quantity,
// 					};
// 				});
// 			})
// 			.catch((err) => console.error(err));
// 	};

// 	deleteCartProduct = (id) => {
// 		const cartItems = this.cart.items.filter((i) => {
// 			return i.productId.toString() !== id.toString();
// 		});

// 		// console.log("cartItems:	", cartItems);
// 		const newCart = { ...this.cart, items: cartItems };
// 		const db = getDb();
// 		return db.collection("users").updateOne(
// 			{
// 				_id: ObjectId(this._id),
// 			},
// 			{
// 				$set: { cart: newCart },
// 			}
// 		);
// 	};
// }

// export default User;
