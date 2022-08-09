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

function getRandomNumber(maxValue) {
    return Math.ceil(Math.random() * maxValue);
}

function getRandomGameId() {
    return Math.floor(Math.random() * 1000000000).toString();
}

app.use('/', express.static("public"));

//middleware - updated to avoid the body-parser deprecation warning.
app.use('/api/', express.json());

// TODO: Create your backend API here:

app.post("/api/newgame/:maxvalue", function (req, res) {
    const maxValue =  parseInt(req.params.maxvalue);
    const displayTxt = `Guess a number 1 to ${maxValue}`;
    const answer = getRandomNumber(maxValue);
    const gameId = getRandomGameId();

    data[gameId] = {"answer":answer, "counter":0};
    saveToServer(data);
    
    res.send({"display":displayTxt, "counter":0, "gameid":gameId});
    res.end();
    
});

app.get("/api/cheat/:gameid", function (req, res) {
    const gameId = req.params.gameid;
    // const displayTxt = `Guess a number 1 to ${maxValue}`;
    // const answer = getRandomNumber(maxValue);

    const rst = data[gameId];
    if(rst){
        const answer = rst.answer;
        const counter = rst.counter;
        res.send({"answer":answer, "counter":counter});
        res.end();
    }    
});

app.put("/api/guess/:gameid/:currentguess", function (req, res) {
    const gameId = req.params.gameid;
    const guessNum =  parseInt(req.params.currentguess);
    const rst = data[gameId];
    let displayText = "";
    if(rst){
       const answer = rst.answer;
       const counter = rst.counter;
       data[gameId] = {"answer":answer, "counter":counter+1};

       if(guessNum < answer){
            displayText = `Too low! Guesses = ${counter+1}`;
       }else if(guessNum > answer){
            displayText = `Too high! Guesses = ${counter+1}`;
       }else{
            displayText = `Correst! You got it in ${counter+1} guesses!`;
       }
       
       saveToServer(data);
       res.send({"display":displayText, "counter":counter+1, "gameid":gameId});
       res.end();

    }
});


app.listen(3000);