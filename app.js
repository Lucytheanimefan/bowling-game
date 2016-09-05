var file = require('file-system');
var fs = require('fs');
var pg = require('pg');
var serveIndex = require('serve-index');
var path = require('path');

var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var dbOperations = require("./dbOperations.js");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use("/", serveIndex("public"));


app.use(express.static(path.join(__dirname, 'public')));

//write to database
/*
pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
*/

app.get('/createTable', function(req,res){
    dbOperations.createTable(req,res);
});

app.get('/sendDataToBackend', function(req, res) {
    console.log("In the backend");
    //console.log(res);
    //console.log(req._parsedOriginalUrl.query);
    var tempJson = req._parsedOriginalUrl.query;
    var json = replaceAll(tempJson, '%22', '"');
    json = replaceAll(json, "%20", " ");
    console.log(json);
    dbOperations.addRecord(req);
    writeDataToFile(json, false);
    //console.log("Backend: "+JSON.stringify(req.body));
});


//testing purposes
app.get('/test', function(req, res) {
    var testJson = {"fName":"Lucy", "lName":"Zhang", "email":"spothorse9.lucy","mbl":"9082405834"}; 
    dbOperations.addRecord(testJson);
    //writeDataToFile(json, false);
    //console.log("Backend: "+JSON.stringify(req.body));
});

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

var stream = fs.createWriteStream("data.txt");

function writeDataToFile(data) {
    fs.appendFile('data.txt', data + "\n", function(err) {
    	console.log(err);
    });
}

console.log("Finished serving");


app.listen(process.env.PORT || 3000);
