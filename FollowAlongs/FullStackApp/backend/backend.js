var express = require('express');
var app = express();
var cors = require("cors");
let data=[];

const logger = require("morgan");
app.use(cors());
app.use(logger('dev')); //helpful information serverside

const fs = require('fs');
const serverSideStorage = "../data/db.json";

fs.readFile(serverSideStorage, function(err, buf) {
    if(err){
        console.log("error: ", err);
    }else{
        data = JSON.parse(buf.toString());
        if(data.length != 0){
            counter = data[data.length-1];
        }
    }
    console.log("Data read from file.");
});

function saveToServer(data){
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err, buf){
        if(err){
            console.log("error: ", err);
        }else{
            console.log("Data saved successfully!");
        }
    });
}




var bodyParser = require("body-parser");
app.use('/api/', bodyParser.urlencoded({extended:true}));
app.use('/api/', bodyParser.json());

app.get("/api/", function(req, res){
    res.send(data);
    res.end();
});

//CREATE
app.post("/api/", function(req, res){
    let name = req.body.name;
    let counter = req.body.count;

    data.push({"name":name, "count":counter});
    saveToServer(data);
    res.send("POST successful!");
    res.end();
});

//READ ONE
app.get("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    let result = data[id];
    res.send(result);
    res.end();

}).put("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    let name = req.body.name;
    let counter = req.body.count;

    data[id] = {"name":name, "count":counter};
    saveToServer(data);
    res.send("PUT successful!");
    res.end();

}).delete("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    data.splice(id, 1);
    saveToServer(data);
    res.send("DELETE successful!");
    res.end();

});

app.listen(3000);