
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var gracefulshutdown = require('./gracefulshutdown');
var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
var db;

var closed = false;

var closeConnection = function() {
    if (!closed) {
        db.close();
        closed = true;
    }
};

// Initialize connection once
MongoClient.connect(config.mongo.CONNECTION, function(err, database) {
  if (err) throw err;
  db = database;
  gracefulshutdown.addShutdownCallback(closeConnection);
});


var insertErrorCheck = function(err, inserted) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
};

var insertDocument = function(collection, doc) {
    db.collection(collection).insert(doc, insertErrorCheck);
};

var find = function(database, collection, query, callback) {
    database.collection(collection).find(query).toArray(callback);
};


var getDB = function() {
    return db;
};

module.exports.insertDocument = insertDocument;
module.exports.find = find;