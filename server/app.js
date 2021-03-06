var app         = require('express')();
var MongoClient = require('mongodb').MongoClient;
var bodyParser  = require('body-parser');
config          = require("./config");
var url         = config.url;


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.get('/users', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        db.collection('users').find({}).toArray(function (err, docs) {
            console.log("Found records");
            res.send(docs);
            db.close();
        });

    });

});


app.post('/user', function (req, res) {
    console.log(req.body);

    MongoClient.connect(url, function (err, db) {

        db.collection('users').find().count(function(error, nbDocs) {
            // Do what you need the count for here.
            db.collection('users').insert({id: parseInt((nbDocs + 1), 10), first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password}, function (err, docs) {
                console.log("inserted the  records");
                if (!err)
                    res.send({status:200});
                else
                    res.send(err);
                db.close();
            });
        });
    });
});


app.get('/user/:id', function (req, res) {
    console.log(req.body);

    MongoClient.connect(url, function (err, db) {

        db.collection('users').findOne({'id': parseInt(req.params.id, 10)}, function (err, docs) {
            console.log("get the  records");
            if (!err)
                res.send(docs);
            else
                res.send(err);
            db.close();
        });
    });
});
app.delete('/user/:id', function (req, res) {

    console.log(req.params);


    MongoClient.connect(url, function (err, db) {

        db.collection('users').remove({'id': parseInt(req.params.id, 10)})

        //db.collection('users').insert({id:req.body.id,first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,password:req.body.password},function(err, docs) {
        //console.log("inserted the  records");
        if (!err)
            res.send({status:200});
        else
            res.send(err);
        db.close();
    });

});


app.put('/user/:id', function (req, res) {

   // console.log('UPDATE', req.params, ;req.body, JSON.stringify({id: req.body._id, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password}));

 //db.users.update( { _id: "57151b193a3d87fe17ed48ec"},{ $set : { first_name: "testname"}});



 console.log(req.body)

    MongoClient.connect(url, function (err, db) {

        db.collection('users').update( { id: (req.body.id)}, { id: req.body.id,first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password}, function(err, data){

        if (!err)
            res.send({status:200});
        else
            res.send(err);
        db.close();
    });

});
});

app.listen(3000);


