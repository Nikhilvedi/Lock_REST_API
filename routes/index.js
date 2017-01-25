var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var util = require('util')
var bodyParser = require('body-parser');
var app = express();
var moment = require('moment');


//needed to be able to run child_proccess in browser
app.get('/javascript/jquery.min.js', function (req, res) {
        res.sendFile( __dirname + "/javascript" + "/jquery.min.js" );

});

router.get('/', function(req, res){
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

router.post('/unLock', function(req, res){
  var now = moment().toDate();
     //print to console when the lock is being operated
     //work out how to save this date info in mongo for lookup on the app
	console.log(req.body.name + " unlock attempt on LockID: " + req.body.LockID + " at " + now );
    // ip when conected to mac via ethernet is 192.168.2.2
    //change to ls to demo it working without the lock on the network
exec('ssh pi@192.168.1.161 sudo python /home/pi/unlock.py', (e, stdout, stderr)=> {
  if (e instanceof Error) {
    //throw err;
    if(e) {
        console.log(req.body.name + " unlock failed at " + now + " due to " + e);
      return res.status(500).send({
                    success: false,
        message : "Error: Unable to connect to lock, please check its internet connection"});
    }
  }
  else {
    console.log(req.body.name + " unlock success at " + now );


  res.json({
    success : true,
    message : "unlock successful by "+req.body.name});

}
});
});

router.post('/Lock', function(req, res){
  var now = moment().toDate();
     //print to console when the lock is being operated
     //work out how to save this date info in mongo for lookup on the app
  console.log(req.body.name + " lock attempt on LockID: " + req.body.LockID + " at " + now );
    // ip when conected to mac via ethernet is 192.168.2.2
    //change to ls to demo it working without the lock on the network
exec('ssh pi@192.168.1.161 sudo python /home/pi/lock.py', (e, stdout, stderr)=> {
  if (e instanceof Error) {
    //throw err;
    if(e) {
        console.log(req.body.name + " lock failed at " + now + " due to " + e);
      return res.status(500).send({
                    success: false,
        message : "Error: Unable to connect to lock, please check its internet connection"});
    }
  }
  else {
    console.log(req.body.name + " lock success at " + now );


  res.json({
    success : true,
    message : "lock successful by "+req.body.name});

}
});
});



module.exports = router;
