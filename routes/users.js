var express = require('express');
var router  = express.Router();
var mongoOp = require("../model/mongo");
var jwt     = require('jsonwebtoken');
var config  = require('../config/database'); // get db config file

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// creating a user
      router.route("/").post( function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false,
      message: 'Please pass Email and Password.'});
  } else {
    var db = new mongoOp({
      name: req.body.name,
      password: req.body.password,
      LockID: req.body.LockID
    });
    // save the user
    console.log('create new user: ' + db);
    db.save(function(err) {
      if (err) {
        return res.status(500).send({
                      success: false,
                      message: 'Email already exists.'
                    });
    }
      res.json({success: true,
         message: 'Successfully created new user.'});
    });
  }
});

// authenticate said user
//not sure if this should be put or post, PUT breaks it in swift
router.post('/authenticate', function(req, res) {

  // find the user
  mongoOp.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;
  console.log(req.body.name);
  console.log(req.body.password);
//console.log(user.LockID);
    if (!user) {
      res.json({ success: false,
        message: 'Authentication failed. User not found.' });

    } else if (user) {

      // check if password matches

      user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                // if user is found and password is right create a token
            //    var token = jwt.encode(user, config.secret); - old way
            var token = jwt.sign(user, config.secret, {
                expiresIn: '1h' // expires in 1 hour
             });
          // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          LockID : user.LockID
        //  token
        });
      }
  });
}
});

//  console.log(name);
});

router.route('/returnLockID').post(function(req, res){
mongoOp.findOne({
       name: req.body.name
    }, function(err, user) {    if(err) {
        response = {"success" : true,"message" : "Error fetching data"};
        res.json(response);
    } else {
    // we got data from Mongo.
    // change it accordingly.
        if(req.body.LockID !== undefined) {
            // case where email needs to be updated.
            user.LockID = req.body.LockID;
      //  save the data
        user.save(function(err){
            if(err) {
              return res.status(500).send({
                            success: false,
                message : "Error updating data"});
            } else {
                response = {success : true,
                message : "Data is updated for "+req.body.name};
            }
              res.json(response);
              console.log(req.body.LockID);
        })
      }
    }
})
});


// use the token in all further requests

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        console.log(err);
        return res.json({ success: false,
           message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token return an error

    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

router.route("/all").get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })


    //this isnt working correctly i dont think
//get by id using GET http://localhost:3000/users/id
      router.route("/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    //not sure if the below works atm


    //update data of a user
    .put(function(req,res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
            // we got data from Mongo.
            // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    //DELETE http://localhost:3000/users/id
    //delete data
    .delete(function(req,res){
        var response = {};
        // find the data
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })




module.exports = router;
