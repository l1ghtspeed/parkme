const express = require('express');
const requireDirectory = require('require-directory');

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

const app = express();

const endpoints = requireDirectory(module, './endpoints');

for (const name in endpoints) {
    // noinspection JSUnfilteredForInLoop
    let endpoint = endpoints[name];
    global.logger.debug(`Adding ${endpoint.method.toUpperCase()} handler for route ${endpoint.route}`);
    app[endpoint.method.toLowerCase()](endpoint.route, endpoint.handler);
}

app.listen(3000, () => {
    console.log('Listening on port 3000');
});