var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
  var MongoClient = require('mongodb').MongoClient
      , assert = require('assert');

  MongoClient.connect(dbUrl, function(err, db) {
    if(err) { return console.dir(err); }



    switch (req.query) {

    }




    db.collection('note', function(err, collection) {
      var document = {name:"David", title:"About MongoDB"};
     /* collection.insert(document, {w: 1}, function(err, records){
        console.log("Record added as "+records[0]._id);
      });*/

      collection.find({}).toArray(function(err, docs) {
        console.log("Found the following records");
        var json = JSON.stringify(docs);

        res.json(json);
      });

    });

   /* db.collection('test', function(err, collection) {});

    db.collection('test', {w:1}, function(err, collection) {});

    db.createCollection('test', function(err, collection) {});

    db.createCollection('test', {w:1}, function(err, collection) {});*/

  });
  //res.send('respond with a resource' +req.query.id);
});

module.exports = router;
