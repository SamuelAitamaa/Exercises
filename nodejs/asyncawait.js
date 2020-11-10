var express = require('express');
var app = express();
const util = require('util');
var url = require('url');
var mysql = require('mysql');


let con = mysql.createConnection({
    host: "localhost",
    user: "user1",
    password: "password1",
    database: "example_db"
});
const query = util.promisify(con.query).bind(con);
app.get('/', function (req, res) {

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM location", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    });
})

// parametrien kirjoitustapa selaimessa : http://localhost:8080/api/events?start=2019-11-01&end=2020-11-29
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
            //string = simpleStringify(rows);
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

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Testi");
    console.log("Example app listening at http://%s:%s", host, port)
})