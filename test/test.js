"use strict";
// NPM install mongoose and chai. Make sure mocha is globally
// installed
const mongoose = require('mongoose');
var mongoOp = require("../model/mongo");
const chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../routes/index.js');
var should = chai.should();

chai.use(chaiHttp);
const expect = chai.expect;
mongoose.Promise = global.Promise;

  describe('Lock Authentication Collection', function() {
    it('Save user schema to database', function(done) {
      var db = new mongoOp.userLogin({
          name: '1@test.com',
          password: 'P@ssword123',
          LockID: 'x2353',
          firstname: 'John'
      });
      // save the user
      db.save(function(err) {
          if (err) {
                done(err);
              } else {
                    done();
                  }
          });
      });
    });
