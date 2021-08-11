"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var distance_1 = __importDefault(require("@turf/distance"));
var express = require('express');
var cors = require('cors');
var app = express();
//enable cors for all origins
app.use(cors());
var bodyParser = require('body-parser');
var port = 3001;
// parse application/json
app.use(bodyParser.json());
app.use(cors());
// Gets goal position
app.post('/getGoalPos', function (req, res) {
    //goal raduis in km
    // user position as an array [lng,lat]
    var _a = req.body, radius = _a.radius, userPosition = _a.userPosition;
    //Checks if all needed data exist
    if (!(userPosition || userPosition[0] || userPosition[1] || radius)) {
        console.log("ERROR", req.body);
        res.status(400).send({ err: "not enought data" });
        return;
    }
    //Latitude: 1 deg = 110.574 km.
    radius = radius / 110.574;
    //Random radius
    var r = radius * Math.sqrt(Math.random());
    //Random direction
    var theta = Math.random() * 2 * Math.PI;
    var randomLat = userPosition[0] + r * Math.cos(theta);
    var randomLong = userPosition[1] + r * Math.sin(theta);
    //Sends random goal coordinate 
    res.send({ randomGoal: [randomLong, randomLat] });
});
// Gets goal position 
// 
app.post('/colision', function (req, res) {
    //colision radius in km
    var _a = req.body, goalPosition = _a.goalPosition, userPosition = _a.userPosition, radius = _a.radius;
    //Checks if all needed data exist
    if (!(goalPosition && userPosition && radius)) {
        res.status(400).send({ err: "not enought data" });
        return;
    }
    //checks if there is a colission
    var colissionCheck = distance_1.default(userPosition, goalPosition) - radius < 0;
    //Sends if distance less then the input radius 
    res.send({ colissionCheck: colissionCheck });
});
app.listen(port, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on " + port);
});
