var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
//var router      =   express.Router();

var index = require('./routes/index');
var users = require('./routes/users');
//var exec = require('child_process').execSync;

//var util = require('util')
//var mongoOp = require("./model/mongo");
//var exec = require('child_process').exec;
var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
// view engine setup
// all views passed through views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//for webpages
// app.get('/javascript/jquery.min.js', function(req, res) {
//     res.sendFile(__dirname + "/javascript" + "/jquery.min.js");
//
// });
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.post('/', function(req, res) {
    console.log(req.body);
    res.send(200);

});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
