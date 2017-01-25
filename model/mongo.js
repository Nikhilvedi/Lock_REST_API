var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/lock');
var bcrypt = require('bcrypt');

// create instance of Schema
var mongoSchema =   mongoose.Schema;
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
    }
});

// var LockSchema = new mongoSchema({
//   hasLock: {
//     type: Boolean,
//     required: false
//   },
//   LockID: {
//     type: String,
//     required: false
//   }
// });

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
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

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// create model if not exists.
module.exports = mongoose.model('userLogin',UserSchema);
//module.exports = mongoose.model('userLock',LockSchema);
