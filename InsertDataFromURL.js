var express = require('express');
var mongodb = require('mongodb');
var jsdom = require("jsdom");
var fs = require("fs");
var cons = require('consolidate');
var mongoose = require('mongoose');
var path = require('path');

//var routes = require('./test');




var bodyParser = require('body-parser');
var MongoClient = mongodb.MongoClient;//mongo client version


//var url = 'mongodb://admin:.main.@ds053184.mongolab.com:53184/maindb';//mongo client version
var url = 'mongodb://admin:.main.@ds015690.mlab.com:15690/zhark_db';//mongo client version


var app = express();
var id = null;
var mac = null;




//mongoose.connect("mongodb://admin:.main.@ds053184.mongolab.com:53184/maindb");// mongoose version

app.engine('html',cons.swig);
app.set('view engine','html');
app.set('views',__dirname );


app.use(bodyParser.urlencoded({ extended: true }));
//app.use('/test',routes);






app.get('/up', function(request, response ) {

     id = request.query.serial_id;//GET Pattern
   // id = request.body.serialNo;//POST Pattern

    mac = request.query.mac_address;//GET Pattern
   // mac = request.body.mac;//POST Pattern

    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //-HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            //-Get the documents collection is the table
            var collection = db.collection('device');


            //-Create some users
            var newApplication = {serialNo:  id ,mac : mac};

            //-Insert some users
            collection.insert([newApplication], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents ' +
                    'inserted with "_id" are:', result.length, result);

                }

            });


            //-Read data from db
            var searchApp = {serialNo:  id ,mac : mac};
            collection.find(searchApp).toArray(

                function(err, result){

                    if (err) {
                        console.log(err);
                    } else {

                        for(index in result){

                            console.log("------------Result---------------");
                            console.log(result[index]);
                            console.log("----------Result End-------------");

                            response.write('<!doctype html>\n<html lang="en">\n' +
                            '\n<meta charset="utf-8">\n<title>Zhark Connect Activated</title>\n' +
                            '\n\n<h1>Zhark Automation</h1>\n' +
                            '<p>Loading Data Done.</p>' +
                            '\n\n');


                        }




                    }


                    //-----------------
                    //Close connection
                    //-----------------
                    db.close();

                });
        }
    });



    //response.end("Please Hold on until the authentication completes... \nApplication ID : "+id+"\nMAC Address : "+mac);
    //response.render('index',{'host':'Activatior Host'});

});

//Sample link to test.
//http://localhost:3000/activator?serial_id=XE03394FSNE2943000&mac_address=qweeeq

app.listen(3000);
console.log("Cheque print app started at http://localhost:3000 \nSample Query pattern and parameter - " +
"http://localhost:3000/up?serial_id=XE03394FSNE2943000&mac_address=qweeeq");