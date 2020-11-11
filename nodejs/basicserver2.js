var express = require('express');
var app = express();
const util = require('util');
//var path = require('path');
//var bodyParser = require('body-parser');
var url = require('url');


/*var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());*/


var mysql = require('mysql');

let con = mysql.createPool({
    host: "localhost",
    user: "user1",
    password: "password1",
    database: "example_db"
});
const query = util.promisify(con.query).bind(con);
app.get('/', function (req, res) {

    con.getConnection(function (err, connection) {
        if (err) throw err;
        con.query("SELECT * FROM location", function (err, result, fields) {
            if (err) throw err;
            connection.release();
            console.log(result);
            let values = JSON.parse(JSON.stringify(result));
            console.log(values);
            res.send(result);
        });
    });
})

// Github ratkaisu


var result = [];
var  getInformationFromDB = function(callback) {
    con.getConnection(function(err, connection) {
        con.query('SELECT * FROM location', function (err, res, fields) {
            connection.release();
            if (err) return callback(err);
            if (res.length) {
                for (var i = 0; i < res.length; i++) {
                    result.push(res[i]);
                }
            }
            callback(null, result);
        });
    });
}

console.log("Call Function");
getInformationFromDB(function (err, result) {
    if (err) console.log("Database error!");
    //else console.log(result);
});

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
    console.log("Got a GET request for /list_user");
    res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
})

/*app.get('/events', function(req, res) {
    res.sendFile(path.join(__dirname+'/listofevents.html'));
})

/*app.post("/api/event", urlencodedParser, function(req, res) {
    console.log("GOT")
    var jsonObj = req.body;


})*/

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Testi");
    console.log("Example app listening at http://%s:%s", host, port)
})