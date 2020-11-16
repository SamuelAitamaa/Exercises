var express = require('express');
var app = express();
const util = require('util');
var url = require('url');
var mysql = require('mysql');
let bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

let con = mysql.createPool({
    host: "localhost",
    user: "user1",
    password: "password1",
    database: "example_db"
});
const query = util.promisify(con.query).bind(con);

// http://localhost:8080/api/events?start=2019-11-01&end=2020-11-29
app.get("/api/events", function (req, res) {
    console.log("Get events from a certain period");
    var q = url.parse(req.url, true).query;
    var params = q.start + " " + q.end;
    var startDate = q.start;
    var endDate = q.end;
    var alteredResult;
    var string;
    //res.send("Getting events: "+params);

    var sql = "SELECT event_date.Date, event.Name, event.Type, Location.Location_name"
        + " FROM event_date, event, location"
        + " WHERE event_date.Event_id = event.Event_id and event.Location_Location_id = Location.Location_id"
        + " and event_date.Date >= ? and event_date.Date <= ?"
        + " GROUP BY Name"
        + " ORDER BY event_date.Date";

    (async () => {
        try {
            const rows = await query(sql,[startDate, endDate]);
            string = JSON.stringify(rows);
            alteredResult = '{"numOfRows":'+rows.length+',"rows":'+string+'}';
            console.log(rows);
            res.send(alteredResult);

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
        finally {
            //conn.end();
        }
    })()
});


// http://localhost:8080/api/location?name=Tavastia
// 08 Huvittelupaikan tietojen näyttäminen JSON-muodossa
app.get("/api/location", function (req, res) {
    console.log("Get event's address by it's name");
    var q = url.parse(req.url, true).query;
    var location = q.name;
    var alteredResult;
    var string;
    //res.send("Getting events: "+params);

    var sql = "SELECT Street_address, City, Zip, Country" +
        " FROM location " +
        "WHERE Location_name = ?";

    (async () => {
        try {
            const rows = await query(sql,[location]);
            string = JSON.stringify(rows);
            console.log(json);
            alteredResult = '{"numOfRows":'+rows.length+',"rows":'+string+'}';
           /*alteredResult = 'Street address: ' + rows[0].Street_address + '<br>'  +
                            'City: ' + rows[0].City + '<br>' +
                            'Zip: ' + rows[0].Zip + '<br>' +
                            'Country: ' + rows[0].Country;*/
            console.log(rows);
            res.send(alteredResult);

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
        finally {
            //conn.end();
        }
    })()
});

// JSON tiedot Postmanilla
app.post("/api/event", urlencodedParser, function(req, res) {
    console.log("Got a POST request for the homepage");

    console.log("body: %j", req.body);

    var jsonObj = req.body;
    console.log("Tapahtuman nimi: " + jsonObj.eventName);

    if (jsonObj.eventLocation > 0) {
            (async() => {
                try {
                    var sql = "INSERT INTO event (Name, Type, Location_Location_id) VALUES (?, ?, ?)";
                    const result = await query(sql, [jsonObj.eventName, jsonObj.eventType, jsonObj.eventLocation]);

                    let insertedId = result.insertId;
                    sql = "INSERT INTO event_date (Date, Event_id) VALUES (?, ?)";
                    const resultEvent_id = await query(sql, [jsonObj.eventDate, insertedId]);

                    await query(sql,[jsonObj.eventDate, insertedId]);
                    res.send('POST succesful ' + req.body);
                } catch(err) {
                    console.log("Error: " + err);
                }
            })()
    }

});


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Testi");
    console.log("Example app listening at http://%s:%s", host, port)
})