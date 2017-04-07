/**
* @class App
* @classdesc The main server architecture and controlling class
* @summary This class handles the importing of many different packages and modules, setting them up for use within the project
* @version 1.0
* @author Nikhil Vedi
* @copyright 2017
*/

/**
 * Import the relevant packages
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * Plug in promises library as Mongoose promises are depreciated
 */
mongoose.Promise = global.Promise;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

/**
* To support JSON-encoded bodies
*/
app.use(bodyParser.json());

/**
* To support URL-encoded bodies
*/
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
* view engine setup
* all views passed through views
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
* Set up the relevant views / for index and /users for users
*/
app.use('/', index);
app.use('/users', users);

/**
* catch 404 and forward to error handler
*/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.post('/', function(req, res) {
    console.log(req.body);
    res.send(200);

});

/**
* error handler
*/
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    /**
    * render the error page
    */
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
