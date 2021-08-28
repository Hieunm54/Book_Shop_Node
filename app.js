import express from "express";
import path from "path";
import methodOverride from "method-override";

import adminRouter from './router/admin-route.js';
import productRouter from './router/shop-route.js';

import ErrorHandler from './controllers/error-controllers.js';
const errorHandler = new ErrorHandler();

import mongoConnect from './util/database.js'

const __dirname = path.resolve();

const app = express();
app.set('views', './views/pug'); // show where the template files are located
app.set('view engine', 'pug'); // set the engine to use

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb connection



//* override with POST having ?_method= PUT/DELETE
app.use(methodOverride('_method'));

app.use('/admin',adminRouter);
app.use(productRouter);


app.use(errorHandler.notFoundPage);

mongoConnect(() => {
    app.listen(3000);
});