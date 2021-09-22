import express from "express";
import path from "path";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';

import adminRouter from "./router/admin-route.js";
import productRouter from "./router/shop-route.js";
import authRouter from "./router/auth-route.js";

import ErrorHandler from "./controllers/error-controllers.js";
const errorHandler = new ErrorHandler();

const MongoDBStore = mongoDBSession(session);
dotenv.config();

let uri = process.env.MONGODB_URI;

// import mongoConnect from "./util/database.js";
import User from "./models/user.js";

const __dirname = path.resolve();

const app = express();
app.set("views", "./views/pug"); // show where the template files are located
app.set("view engine", "pug"); // set the engine to use

//connect to db to store session
const store = new MongoDBStore({
	uri: uri,
	collection: 'sessions'
}, function(err, db) { //handle error when connect to db- store session
	console.log(err)
})

store.on('error', function(err){
	console.log(err);
})


// config session
app.use(session({
	secret: process.env.SESSION_STORE_PASSWORD,
	resave: false,
	saveUninitialized: false,
	store: store
}))

// serve static file
app.use(express.static(path.join(__dirname, "public")));

// serve body in res
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb connection
//* override with POST having ?_method= PUT/DELETE
app.use(methodOverride("_method"));

// app.use((req, res, next) => {
// 	if( req.session.isLoggedIn){
// 		req.session.user = new User().init(req.session.user);
// 	}
// 	next();
// 	// User.findById("61459f3c7e97d87531157435")
// 	// 	.then((user) => {
// 	// 		req.user = user
// 	// 		next();
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		console.log("Error");
// 	// 	});
// });

app.use((req,res, next)=>{
	if( !req.session.user){
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			req.user = user
			next();
		})
		.catch((err) => {
			console.log(err);
		});
})

// register router
app.use("/admin", adminRouter);
app.use(productRouter);
app.use(authRouter);

app.use(errorHandler.notFoundPage);


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
