const express = require('express');
const requireDirectory = require('require-directory');
const firebase = require('firebase');
const firebaseSecret = require('./firebaseSecret');
const firebaseKEY = firebaseSecret.apikey;

// Set the configuration for app
let config = {
    apiKey: firebaseKEY,
    authDomain: "parkme-uottahack.firebaseapp.com",
    databaseURL: "https://parkme-uottahack.firebaseio.com/",
};

firebase.initializeApp(config);

// Get a reference to the database service
let database = firebase.database();


//function to print database values
let printData = function() {
    database.ref().once('value')
    .then(function(snapshot) {
        console.log(snapshot.val());
    })
    .catch((error) => {
        console.log('null', error);
    });
}

//function to create new 

let addStreet = function( streetname, long, lat, start, end, duration ){
    firebase.database().ref('/ottawa/' + streetname).update({
        longitude: long,
        latitude: lat,
        start: start,
        end: end,
        duration: duration,
    }).then(() => {
        printData();
    }).catch((error) => {
        console.log('null', error);
    });
}



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
    transport: function(data) {
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

global.logger.info("Starting ParkMe Server v" + packageConfig.version);

const app = express();

const endpoints = requireDirectory(module, "./endpoints");

for (const name in endpoints) {
    // noinspection JSUnfilteredForInLoop
    let endpoint = endpoints[name];
    global.logger.debug(`Adding ${endpoint.method.toUpperCase()} handler for route ${endpoint.route}`);
    app[endpoint.method.toLowerCase()](endpoint.route, endpoint.handler);
}

app.listen(3000, () => {
<<<<<<< HEAD:server.js
    console.log('Listening on port 3000');
    addStreet( 'King Edward', 300, 400, 2, 5, 120 );
=======
    global.logger.info("Listening on port 3000");
>>>>>>> 7ed35e891f4309dbe50a9acb8fb0a2a00565ac1e:index.js
});