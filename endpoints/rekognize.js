const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config');

let durationPattern = /([0-9]+) *(H|min)/gi;
let hrsPattern = /([1-9]+)[0 ]*(AM|PM)[ -]*([1-9]+)[0 ]*(AM|PM)/gi;
let daysPattern = /(SUN|MON|TUE|WED|THU|FRI|SAT)[ -]*(SUN|MON|TUE|WED|THU|FRI|SAT)/gi;

const rekognition = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
});

module.exports = {
    route: "/rekognize",
    method: "GET",
    handler: function(req, res) {
        const params = {
            Image: {
                Bytes: fs.readFileSync('./a.jpg')
            }
        };

        rekognition.detectText(params, (err, data) => {
            if (err) {
                res.json(err);
                global.logger.error(err);
                return;
            }

            const processed = {};

            data["TextDetections"].forEach(item => {
                let matches = [];

                if (matches = durationPattern.exec(item.DetectedText)) {
                    if (matches[2] === "min")
                        processed["duration"] = parseInt(matches[1]);
                    else
                        processed["duration"] = parseInt(matches[1]) * 60;
                } else if (matches = hrsPattern.exec(item.DetectedText)) {
                    let start = parseInt(matches[1]);
                    let end = parseInt(matches[3]);

                    if (matches[2] === "PM")
                        start += 12;

                    if (matches[4] === "PM")
                        end += 12;

                    processed["start"] = start * 60;
                    processed["end"] = end * 60;
                } else if (matches = daysPattern.exec(item.DetectedText)) {
                    processed["startDay"] = textToDay(matches[1]);
                    processed["endDay"] = textToDay(matches[2]);
                }
            });

            res.json(processed);
        });
    }
};

function textToDay(text) {
    switch (text) {
        case "SUN":
            return 0;
        case "MON":
            return 1;
        case "TUE":
            return 2;
        case "WED":
            return 3;
        case "THU":
            return 4;
        case "FRI":
            return 5;
        case "SAT":
            return 6;
    }
}