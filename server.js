const express = require('express');
const requireDirectory = require('require-directory');
const firebase = require('firebase');
const bodyParser = require('body-parser');

const packageConfig = require('./package.json');
const config = require('./config.json');

// Set the configuration for app
let firebaseConfig = {
    apiKey: config.firebaseSecret,
    authDomain: "parkme-uottahack.firebaseapp.com",
    databaseURL: "https://parkme-uottahack.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
let database = firebase.database();


//store current database info
let currentParking;

//function to get database values
let getData = function() {
    return database.ref().once('value')
    .then(function(snapshot) {
        currentParking = snapshot.val();
    })
    .catch((error) => {
        console.log('null', error);
    });
    
}

//function to create new 

let addStreet = function (streetname, long, lat, start, end, duration) {
    firebase.database().ref('/ottawa/' + streetname).update({
        longitude: long,
        latitude: lat,
        start: start,
        end: end,
        duration: duration,
    }).then(() => {
        getData();
    }).catch((error) => {
        console.log('null', error);
    });
};


/*
database.once('value').then(function (snap) {
    console.log(snap);
    callback(null, data);
}).catch((error) => {
    console.log('retrieval failed', error);
    callback('error', null);
});
*/

// noinspection JSUnusedGlobalSymbols
global.logger = require('tracer').colorConsole({
    transport: function (data) {
        console.log(data.output);
    },
    format: [
        "{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}",
        {
            trace: "\033[0;37m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",
            log: "\033[0;37m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",
            debug: "\033[0;34m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",
            info: "\033[0;32m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",
            warn: "\033[0;33m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",
            error: "\033[0;31m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m",  // for colors codes, see:
            fatal: "\033[0;31m{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}\033[0m"   // https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
        }
    ],
    dateformat: "yyyy-mm-dd HH:MM:ss.l"
});

//lobal.logger.info("Starting ParkMe Server v" + packageConfig.version);

const app = express();

const endpoints = requireDirectory(module, "./endpoints");

app.use(bodyParser.raw({type: '*/*', limit: '5mb'}));

for (const name in endpoints) {
    // noinspection JSUnfilteredForInLoop
    let endpoint = endpoints[name];
    global.logger.debug(`Adding ${endpoint.method.toUpperCase()} handler for route /api${endpoint.route}`);
    app[endpoint.method.toLowerCase()]('/api' + endpoint.route, endpoint.handler);
}
app.use('/', express.static('public/public'));



// use it before all route definitions
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'null');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', async function(request,response){
    //code to perform particular action.
    //To access GET variable use.
    //request.var1, request.var2 etc
    await getData();
    response.send(currentParking);
    response.end();
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});