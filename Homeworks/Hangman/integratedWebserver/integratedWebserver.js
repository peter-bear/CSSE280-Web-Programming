const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.urlencoded({
    extended: true
}));
app.use('/api/', bodyParser.json());

// Data from a file.
let data = [];
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

function checkIdValid(id){
    return id>=0 && id<data.length;
}

// ------------------------------------------------------------------------
// Admin API - Note: the Admin api tells you words.  You are an admin.
// ------------------------------------------------------------------------

/**
 * Create - Add a word to the word list (i.e. the data array)
 *   method:                    POST
 *   path:                      /api/admin/add
 *   expected request body:     {"word": "..."}
 *   side effects:              saves the word onto the data array
 *   response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.
app.post('/api/admin/add', function(req, res){
    let word = req.body.word;

    data.push(word);
    saveToServer(data);
    res.send({"word":word, "index":data.length-1});
    res.end();

});


/**
 * Read all	- Get all words
 *   method:                    GET
 *   path:                      /api/admin/words
 *   expected request body:     none
 *   side effects:              none (as is the case for all GETs)
 *   response:                  {"words": ["...", "..."], "length": #}
 */

// TODO: Add your code here.
app.get('/api/admin/words', function(req,res){
    res.send({"words":data, "length":data.length});
    res.end();
});



/**
 *  Read one - Get a single word at index
 *    method:                    GET
 *    path:                      /api/admin/word/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.
app.get('/api/admin/word/:id', function(req, res){
    let id = parseInt(req.params.id);
    if(!checkIdValid(id)){
        return;
    }
    res.send({"word":data[id],"index":id});
    res.end();
});


/**
 *  Update - Update a word at index
 *    method:                    PUT
 *    path:                      /api/admin/word/:id
 *    expected request body:     {"word": "..."} (notice the path parameter is also present)
 *    side effects:              saves the new word into that location in the data array
 *    response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.
app.put('/api/admin/word/:id', function(req,res){
    let id = parseInt(req.params.id);
    if(!checkIdValid(id)){
        return;
    }

    let word = req.body.word;
    data[id] = word;
    saveToServer(data);
    res.send({"word":word,"index":id});
    res.end();
});

/**
 *  Delete
 *    method:                    DELETE
 *    path:                      /api/admin/word/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              deletes the new word at that index from the data array
 *    response:                  {"index": #}  (i.e. the index that got deleted)
 */

// TODO: Add your code here.
app.delete('/api/admin/word/:id', function(req,res){
    let id = parseInt(req.params.id);
    if(!checkIdValid(id)){
        return;
    }
    data.splice(id,1);
    saveToServer(data);
    res.send({"index":id});
    res.end();
});


// ------------------------------------------------------------------------
// Player API - Never shares the word. It is a secret.
// ------------------------------------------------------------------------
/**
 *  Num Words - Get the number of words (i.e. the size of the data array).
 *    method:                    GET
 *    path:                      /api/player/numwords
 *    expected request body:     none
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"length": #}
 */

// TODO: Add your code here.
app.get('/api/player/numwords', function(req, res){
    res.send({"length":data.length});
    res.end();
});


/**
 *  Word Length - Get the length of a single word at the given index.
 *    method:                    GET
 *    path:                      /api/player/wordlength/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"length": #, "index": #}
 */

// TODO: Add your code here.
app.get('/api/player/wordlength/:id', function(req, res){
    let id = parseInt(req.params.id);
    let length = data[id].length;
    res.send({"length":length, "index":id});
    res.end();
});


/**
 *  Guess - Allow the player to make a guess and return where that letter is found in the word.
 *    method:                    GET
 *    path:                      /api/player/guess/:id/:letter
 *    expected request body:     none (notice multiple path parameters instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"letter": ".", "length": #, "index": #, "locations": [#, #, #]}
 *     example real response:    {"letter": "A", "length": 6, "index": 7, "locations": [0]}
 *     notice the length and index are repeat info like Word Length would give.
 *     the interesting field is locations which is always an array, but could be an empty array [].
 */

// TODO: Add your code here.
app.get('/api/player/guess/:id/:letter', function(req, res){
    let id = parseInt(req.params.id);
    let letter = req.params.letter;
    let locations = [];

    let word = data[id];
    for(let i=0;i<word.length;i++){
        if(word[i].toUpperCase() == letter || word[i].toLowerCase() == letter){
            locations.push(i);
        }
    }

    res.send({"letter":letter,"length":word.length, "index":id, "locations":locations});
    res.end();
});



app.listen(3000);