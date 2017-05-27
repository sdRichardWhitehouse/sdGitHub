//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan'),
    promise = require('promise');

console.log("Script Checker");
var meTest = require('./scriptChecker/scriptChecker.js');
var testString = meTest.foo();
var testObject = meTest.runScript().then(function (data) {
  console.log("Carrying on now...");
  console.log(data);
  carryOn(data);
});

function carryOn(urlTestObject) {
  console.log(urlTestObject[0].urls[0]);
  console.log("was the test object");
      
  Object.assign=require('object-assign')

  app.engine('html', require('ejs').renderFile);
  app.use(morgan('combined'))

  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
      ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
      mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
      mongoURLLabel = "";

  if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD']
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
      mongoURLLabel = mongoURL = 'mongodb://';
      if (mongoUser && mongoPassword) {
        mongoURL += mongoUser + ':' + mongoPassword + '@';
      }
      // Provide UI label that excludes user id and pw
      mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
      mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

    }
  }
  var db = null,
      dbDetails = new Object();

  var initDb = function(callback) {
    if (mongoURL == null) return;

    var mongodb = require('mongodb');
    if (mongodb == null) return;

    mongodb.connect(mongoURL, function(err, conn) {
      if (err) {
        callback(err);
        return;
      }

      db = conn;
      dbDetails.databaseName = db.databaseName;
      dbDetails.url = mongoURLLabel;
      dbDetails.type = 'MongoDB';

      console.log('Connected to MongoDB at: %s', mongoURL);
    });
  };

  for (var i = 0; i < urlTestObject.length; i++) {
    console.log(urlTestObject[i].siteId);
    console.log(urlTestObject[i].urls);

    if (urlTestObject[i].urls && urlTestObject[i].urls.length > 0) {
      for (var j = 0; j < urlTestObject[i].urls.length; j++) {
        console.log(urlTestObject[i].urls[j].title);
      }
    }
  }

  app.get('/', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
      initDb(function(err){});
    }
    if (db) {
      var col = db.collection('counts');
      // Create a document with request IP and current time of request
      col.insert({ip: req.ip, date: Date.now()});
      col.count(function(err, count){
        res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails, testString: testString, urlTestObject: urlTestObject });
      });
    } else {
      res.render('index.html', { pageCountMessage : null, testString: testString, urlTestObject: urlTestObject});
    }
  });

  app.get('/pagecount', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
      initDb(function(err){});
    }
    if (db) {
      db.collection('counts').count(function(err, count ){
        res.send('{ pageCount: ' + count + '}');
      });
    } else {
      res.send('{ pageCount: -1 }');
    }
  });

  // error handling
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
  });

  initDb(function(err){
    console.log('Error connecting to Mongo. Message:\n'+err);
  });

  app.listen(port, ip);
  console.log('Server running on http://%s:%s', ip, port);

  module.exports = app ;
}
