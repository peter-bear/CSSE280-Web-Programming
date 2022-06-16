var express = require("express");
var app = express();

let data = {};

const fs = require("fs");
const serverSideStorage = "../data/db.json";

fs.readFile(serverSideStorage, function (err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
    }
    console.log("Data read from file.");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function (err, buf) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("Data saved successfully!");
        }
    })
}

app.use('/', express.static("public"));

//middleware - updated to avoid the body-parser deprecation warning.
app.use('/api/', express.json());

// TODO: Create your backend API here:

// A few API examples to show the syntax...

// app.get("/api/somepath", function (req, res) {
//     res.status(200);
//     res.json({"example": 42});
// });

// app.put("/api/somepath/:mykey", function (req, res) {
//     const mykey =  parseInt(req.params.mykey);
//     const myvalue = req.body.myvalue;
//     data[mykey] = myvalue
//     saveToServer(data);
//     res.status(200);
//     res.json({"example": myvalue});
// }).

// app.post("/api/somepath", function (req, res) {
//     const myvalue = req.body.myvalue;
//     data["exampleArray"].push(myvalue);
//     saveToServer(data)
//     res.status(201);
//     res.json({"example": myvalue});
// });

// app.delete("/api/somepath/:id", function (req, res) {
//     let id =  parseInt(req.params.id);
//     data["exampleArray"].splice(id,1);
//     saveToServer(data);
//     res.sendStatus(204);
// });

app.listen(3000);