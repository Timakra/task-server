import { Request, Response } from 'express';
import distance from '@turf/distance';


const express = require('express');
const cors = require('cors');
const app = express();

//enable cors for all origins
app.use(cors());

var bodyParser = require('body-parser');
const port = 3001;




// parse application/json
app.use(bodyParser.json())
app.use(cors())


// Gets goal position
app.post('/getGoalPos', (req :Request , res:Response) => {
    //goal raduis in km
    // user position as an array [lng,lat]
    let { radius ,userPosition } = req.body as { radius:number ,userPosition: number[] };
    //Checks if all needed data exist
    if(!(userPosition || userPosition[0] || userPosition[1] || radius)){
        console.log("ERROR",req.body)
        res.status(400).send({err:"not enought data"});
        return;
    } 
    
    
    //Latitude: 1 deg = 110.574 km.
    radius = radius / 110.574;
    //Random radius
    let r = radius * Math.sqrt(Math.random());
    //Random direction
    let theta = Math.random() * 2 * Math.PI;
    let randomLat = userPosition[0] + r * Math.cos(theta);
    let randomLong = userPosition[1] + r * Math.sin(theta);

    //Sends random goal coordinate 
    res.send({randomGoal:[randomLong,randomLat]});
});

// Gets goal position 
// 
app.post('/colision', (req :Request, res: Response) => {
    //colision radius in km
    let {goalPosition,userPosition,radius} = req.body as {goalPosition:number[],userPosition:number[],radius:number} ;

    //Checks if all needed data exist
    if(!(goalPosition && userPosition && radius)){
        res.status(400).send({err:"not enought data"});
        return;
    }

    //checks if there is a colission
    let colissionCheck = distance(userPosition,goalPosition) - radius < 0;

    //Sends if distance less then the input radius 
    res.send({colissionCheck});
});



app.listen(port, (err:Error) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});


interface Coords {
    lat: number;
    long: number;
}
