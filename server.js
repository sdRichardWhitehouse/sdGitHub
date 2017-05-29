//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan'),
    promise = require('promise'),
    monk = require('monk'),
    nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);

console.log("Script Checker");
var meTest = require('./scriptChecker/scriptChecker.js');
var testObject = meTest.runScript().then(function (data) {
  console.log("Carrying on now...");
  carryOn(data);

  // https://www.npmjs.com/package/node-schedule
  if(nodeVersion > 5) {
    console.log("not sending email for the moment");
    var email = require('./includes/email.js');
    // email.sendEmail();
  } else {
    console.log("not sending email as node version is " + nodeVersion);
  }
});

function carryOn(urlTestObject) {
      
  Object.assign=require('object-assign')

  app.engine('html', require('ejs').renderFile);
  app.use(morgan('combined'))
  app.use(express.static(__dirname));
  console.log(__dirname);

  var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
      ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
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
    console.log("attempting to connect to mongo...")
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

  if (db === null) {
    console.log("loading mongo db...");
    // var database = require('./includes/database.js');
    // database.connect();
    // database.getSiteList();
  }

  // outputObject(urlTestObject);

  function outputObject (object) {
	for (var key in object) {
		// skip loop if the property is from prototype
		if (!object.hasOwnProperty(key)) continue;

		var obj = object[key];
		for (var prop in obj) {
			// skip loop if the property is from prototype
			if(!obj.hasOwnProperty(prop)) continue;

			// your code

			if (typeof(obj[prop]) == "object") {
				console.log("***" + prop + "***");
				outputObject(obj[prop]);
			} else {
				console.log(prop + " = " + obj[prop] + " = " + typeof(obj[prop]));
			}
			
		}
		console.log("");
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
        res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails, urlTestObject: urlTestObject });
      });
    } else {
      res.render('index.html', { pageCountMessage : null, urlTestObject: urlTestObject});
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

  // Make our db accessible to our router
  app.use(function(req,res,next){
    req.db = db;
    next();
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
