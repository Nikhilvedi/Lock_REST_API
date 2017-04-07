/**
* @class Users
* @classdesc This class handles the users and saving their data to mongoDB.
* @summary Serving the post requests for all methods to do with users and saving the relevant data to mongoDB.
*/

/**
* Import the relevant packages
*/
var express = require('express');
var router = express.Router();
var mongoOp = require("../model/mongo");
var jwt = require('jsonwebtoken');
var config = require('../config/database'); // get db config file

/**
* Create a user for signup
*/
router.route("/").post(function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({
            success: false,
            message: 'Please pass Email and Password.'
        });
    } else {
        var db = new mongoOp.userLogin({
            name: req.body.name,
            password: req.body.password,
            LockID: req.body.LockID,
            firstname: req.body.firstname
        });
        // save the user
        console.log('create new user: ' + db);
        db.save(function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Email already exists, Please try again.'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Successfully created new user.'
            });
        });
    }
});


/**
* Authenticate a user and return them a token
*/
router.post('/authenticate', function(req, res) {

    // find the user
    mongoOp.userLogin.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;
        console.log(req.body.name);
        console.log(req.body.password);
        //console.log(user.LockID);
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });

        } else if (user) {

            // check if password matches

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: '120000' // expires in 2 minutes - 60000 is 60s - measured in ms
                    });
                    // return the information including token as JSON
                    res.status(200).json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        LockID: user.LockID
                    });
                }
                else   res.status(401).json({
                      success: false,
                      Message : "Incorrect password"
                    });
            });
        }
    });
});

/**
* Update or save a lockID
*/
router.route('/returnLockID').post(function(req, res) {
    mongoOp.userLogin.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            response = {
                "success": false,
                "message": "Error fetching data"
            };
            res.status(400).json(response);
        } else {
            // we got data from Mongo.
            // change it accordingly.
            if (req.body.LockID !== undefined) {
                //case where lock needs to be updated
                user.LockID = req.body.LockID;
                //  save the data
                user.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            message: "Error updating data"
                        });
                    } else {
                        response = {
                            success: true,
                            message: "Data is updated for " + req.body.name
                        };
                    }
                    res.status(201).json(response);
                    console.log(req.body.LockID);
                })
            }
        }
    })
});

/**
* Update a users password
*/
router.route("/update").post(function(req, res) {
    // first find out record exists or not
    // if it does then update the record
    mongoOp.userLogin.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            res.status(400).json({
                "success": false,
                "message": "Error fetching data"
            });
        } else {
            // we got data from Mongo.
            // change it accordingly.
            console.log(req.body.name);
            console.log(req.body.password);
            if (req.body.password !== undefined) {
                // case where password needs to be updated
                user.password = req.body.password;
            }
            // save the data
            user.save(function(err) {
                if (err) {
                    response = {
                        "success": false,
                        "message": "Error updating data"
                    };
                } else {
                    response = {
                        "success": true,
                        "message": "Password is updated for " + req.body.name
                    };
                }
                res.json(response);
            })
        }
    });
})


/**
* Use the token in all further requests
*/
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err instanceof Error) {
              //  console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token - Expired.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token return an error
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

/**
* Fetch all data, used for debugging and testing purposes
*/
router.route("/all").get(function(req, res) {
    var response = {};
    mongoOp.userLogin.find({}, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = {
                success : false,
                message: "Error fetching data"
            };
        } else {
            response = {
                 success : true,
                message: data
            };
        }
        res.json(response);
    });
})

/**
* Check if a users token is valid
*/
router.route("/tokencheck").get(function(req, res) {
  mongoOp.userLogin.findOne({
      name: req.body.name
  }, function(err, user) {
      if (err) {
          res.status(400).json({
              "success": false,
              "message": "Error fetching data"
          });
      } else {
        response = {
            "success": true,
            "message": "token valid"
        };
        res.status(200).json(response)
      };
    });
})


module.exports = router;
