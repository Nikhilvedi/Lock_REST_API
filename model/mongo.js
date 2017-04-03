/**
* @class mongo
* @classdesc This class handles the set up of the mongoDB
* @summary Holding the schema for the data being saved to mongoDB.
* This class also takes responsibilty of hashing a users Password
*/

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/lock');
var bcrypt = require('bcrypt');

// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var UserSchema = new mongoSchema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    LockID: {
        type: String,
        required: false
    },
    firstname: {
        type: String,
    },
    updated: {
        type: Date,
        default: Date.now
    }
});


var LockLogSchema = new mongoSchema({
    lockTime: {
        type: String,
    },
    updated: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    }, //for future gps sending from app
    location: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    ID: { //lock id for searching locks and name and returning to user in app
      type: String,
      required: true
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

//why does this have to be this way round? was saving in the wrong collection if userLogin was above UserLog
// create model if not exists.
//logs doesnt work atm

var Logs = mongoose.model('Logs', LockLogSchema);
var userLogin = mongoose.model('userLogin', UserSchema);

//i was exporting module exports in the wrong way, this should hopefully fix it
module.exports = {
    Logs: Logs,
    userLogin: userLogin
};
