/**
* @class Index
* @classdesc This class handles the lock and unlock features of the server
* @summary Serving the post requests for locking and unlocking, exposes the part of the RESTful which allows for calls to:
* Logs, Status, Lock and Unlock
*/

/**
* Import the relevant packages
*/
var express = require('express');
var exec = require('child_process').exec;
var util = require('util')
var bodyParser = require('body-parser');
var moment = require('moment');
var mongoOp = require("../model/mongo");

var router = express.Router();
var app = express();

/**
* render the page to highlight where the API is
*/
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
router.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());

/**
* unlock the door and save a log of the action
*/
router.post('/unLock', function(req, res) {
    var now = moment().format('LLL');
    var ID = req.body.LockID;
    //print to console when the lock is being operated
    console.log(req.body.name + " unlock attempt on LockID: " + req.body.LockID + " at " + now);
    // ip when conected to mac via ethernet is 192.168.2.2
    //change to ls to demo it working without the lock on the network
    //ssh pi@192.168.1.161 sudo python /home/pi/unlock.py
    //
    exec('ssh pi@192.168.1.163 sudo python /home/pi/unlock.py', (e, stdout, stderr) => {
        if (e instanceof Error) {

            if (e) {
                console.log(req.body.name + " unlock failed at " + now + " due to " + e);
                //504 is timeout
                return res.status(504).json({
                    success: false,
                    message: "Error: Unable to connect to lock, please check its internet connection"
                });
            }
        } else {
            console.log(req.body.name + " unlock success at " + now);

            var db = new mongoOp.Logs({
                name: req.body.name,
                lockTime: now,
                type: "UNLOCK",
                ID: ID

            });
            // save the user
            console.log(db);
            db.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "unlock successful by " + req.body.name
                    });
                }
            });
        }
    });
});

/**
* Lock the door and save a log of the action
*/
router.post('/Lock', function(req, res) {
    var now = moment().format('LLL'); //updating date format
    var ID = req.body.LockID;
    //print to console when the lock is being operated
    console.log(req.body.name + " lock attempt on LockID: " + req.body.LockID + " at " + now);
    // ip when conected to mac via ethernet is 192.168.2.2
    //change to ls to demo it working without the lock on the network
    //ssh pi@192.168.1.162 sudo python /home/pi/lock.py
    //
    exec('ssh pi@192.168.1.163 sudo python /home/pi/lock.py', (e, stdout, stderr) => {
        if (e instanceof Error) {

            if (e) {
                console.log(req.body.name + " lock failed at " + now + " due to " + e);
                //504 is timeout
                return res.status(504).json({
                    success: false,
                    message: "Error: Unable to connect to lock, please check its internet connection"
                });
            }
        } else {
            console.log(req.body.name + " lock success at " + now);

            var db = new mongoOp.Logs({
                name: req.body.name,
                lockTime: now,
                type: "LOCK",
                ID: ID
            });
            // save the user
            console.log(db);
            db.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "lock successful by " + req.body.name
                    });
                }
            });
        }
    });
});

/**
* Send back all entries on the LockID
*/
router.post('/Logs', function(req, res) {
  mongoOp.Logs.find({
      ID: req.body.LockID
  }, function(err, data) {
      if (err) {
          response = {
              "success": false,
              "message": "Error fetching data, check connection"
          };
          res.status(400).json(response);
      } else {
        response = {
             success : true,
            message: data
        };
  res.json(response);
}
})
});

/**
* send back the lock status
*/
router.post('/Status', function(req, res) {
  mongoOp.Logs.find({
      ID: req.body.LockID
  }, function(err, data) {
      if (err) {
          response = {
              "success": false,
              "message": "Error fetching data, check connection"
          };
          res.status(400).json(response);
      } else {
        response = {
             success : true,
            message: data
        };
  res.json(response);
  console.log(response);
}
})
});


module.exports = router;
