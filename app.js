import express from "express";
import path from "path";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import adminRouter from "./router/admin-route.js";
import productRouter from "./router/shop-route.js";

import ErrorHandler from "./controllers/error-controllers.js";
const errorHandler = new ErrorHandler();

// import mongoConnect from "./util/database.js";

import User from "./models/user.js";

const __dirname = path.resolve();

const app = express();
app.set("views", "./views/pug"); // show where the template files are located
app.set("view engine", "pug"); // set the engine to use

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb connection
//* override with POST having ?_method= PUT/DELETE
app.use(methodOverride("_method"));

app.use((req, res, next) => {
	User.findById("61459f3c7e97d87531157435")
		.then((user) => {
			req.user = user
			next();
		})
		.catch((err) => {
			console.log("Error");
		});
});

app.use("/admin", adminRouter);
app.use(productRouter);

app.use(errorHandler.notFoundPage);

let uri = process.env.MONGODB_URI;

mongoose.connect(uri)
        .then(() => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Harry',
					email: 'HarryTheDestroyer@gmail.com',
					cart: { items: [] },
				})
				user.save();
			}
		});
		console.log("Connect successfully")
		app.listen(3000);
	})
	.catch((err) => console.error(err));

// mongoConnect(() => {
// 	app.listen(3000);
// });
