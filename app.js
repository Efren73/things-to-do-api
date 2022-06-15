var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors')

require('dotenv').config({ path: '.env' })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tourOperatorRouter = require('./routes/tourOperator')
var admin = require('./routes/admin')

var app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tour-operator', tourOperatorRouter)
app.use('/admin', admin)

app.use('*', (err, req, res, next) => {
    return res.status(500).json({
        "name": err.name,
        "message": `${err.message}, ${err.original ? err.original : ':('}`,
    })
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({ error: err })
});

module.exports = app;