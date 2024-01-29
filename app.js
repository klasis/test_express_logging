var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

require('dotenv').config();

var moranMiddleware = require('./config/morgan.config.js');
var errorMiddleware = require('./config/error.config.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// debug handler
app.use(moranMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// error handler
app.use(errorMiddleware);

module.exports = app;
