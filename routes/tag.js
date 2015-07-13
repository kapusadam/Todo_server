var express = require('express');
var router = express.Router();

var dbCollection, respond, collectionName = "tag";

router.post('/', function(req, res, next) {
    respond = initRespond(req, res);

    var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { return console.dir(err); }

        db.collection(collectionName, function(err, collection) {
            dbCollection = collection;

            switch (req.query.fn) {
                case "create" : createTag(req.query.noteId, req.query.description); break;
                case "update" : update(req.query.id, req.query.description, req.query.isDone); break;
                case "deleteAll" : deleteAll(); break;
                case "delete" : deleteById(req.query.id); break;
                default: res.status(404).send('Not found');
            }

        });

    });
});

router.get('/', function(req, res, next) {

    respond = initRespond(req, res);

    var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { return console.dir(err); }

        db.collection(collectionName, function(err, collection) {
            dbCollection = collection;

            switch (req.query.fn) {
                case "readAll" : getAll(); break;
                case "read" : getById(req.query.id); break;
                case "getByNoteId" : getByNoteId(req.query.noteId); break;
                default: res.status(404).send('Not found');
            }

        });

    });

});

function initRespond(req, res) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342'/*req.rawHeaders[7]*/);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    return res;
}

/*-------------------------------CRUD--------------------------------------*/

function createTag(noteId, description) {
    var tag = {noteId:noteId, description : description, isDone: false};
    dbCollection.insert(tag, function(err, records){
        var ObjectId = require('mongodb').ObjectID;
        respond.json({"_id": new ObjectId(tag._id)});
    });

}

function getAll() {
    dbCollection.find({}).toArray(function(err, notes) {
        respond.json(JSON.stringify(notes));
    });
}

function getById(id) {
    var ObjectId = require('mongodb').ObjectID;
    dbCollection.find({"_id": new ObjectId(id)}).toArray(function(err, note) {
        respond.json(JSON.stringify(note));
    });
}

function getByNoteId(noteId) {
    dbCollection.find({"noteId": noteId}).toArray(function(err, tag) {
        respond.json(JSON.stringify(tag));
    });
}

function update(id, description, isChecked) {
    var ObjectId = require('mongodb').ObjectID;
    dbCollection.update({_id: new ObjectId(id)}, {$set: {description: description, isDone: isChecked}}, function(err, updated) {
        respond.json(JSON.stringify({success: !(err || !updated)}));
    });
}

function deleteAll() {
    dbCollection.remove();
    respond.json(JSON.stringify({success:true}));
}

function deleteById(id) {
    var ObjectId = require('mongodb').ObjectID;
    dbCollection.remove({"_id": new ObjectId(id)});
    respond.json(JSON.stringify({success:true}));
}

module.exports = router;
