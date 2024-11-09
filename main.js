import { findIntersection } from './modules/intersections.js';
import { calculateBearingAndDistance } from './modules/bearingAndDistanceCalculations.js';
import * as dataFormatter from './modules/dataFormatter.js'
import * as drawer from './modules/drawer.js'
import * as intersections from './modules/intersections.js'


var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;

const ctx = canvas.getContext("2d");

const distanceCoeficient = 100;

const magneticDeviation = -11;

const originCoordinateName = "rw06";
const path = ["dimgi", "vivzo", "mefed", "logpu", "duzev", "otsur", "gekla", "enmur", "kibur", "lo", "bemas", "tebdi", "tepta", "fidot", "roruk"];
const path1 = ["emgas", "lazit", "riren", "ofira", "somag", "roruk", "ww058", "ww192", "ww191"];

const testRoute = 
{
    name: "test",
    route: {
        test1 : "280",
        test2 : "250"
    }
}

const dimgi3A = {
    name: "dimgi3A",
    route: {
        dimgi: "280",
        vivzo: "270",
        mefed: "260",
        logpu: "240",
        duzev: "220",
        otsur: "200",
        gekla: "190",
        enmur: "150-160",
        kibur: "150",
        lo: "130-140",
        bemas: "110-130",
        tebdi: "100",
        tepta: "80",
        fidot: "70",
        roruk: "60"
    }
}


dataFormatter.getCoordinatesData().then(rawCoordinatesData => {
    let formattedCoordinates = dataFormatter.getformatedCoordinates(rawCoordinatesData);
    //console.log(formattedCoordinates);

    let formattedCoordinatesToCartesion =
        dataFormatter.getformatedCoordinatesToCartesion(formattedCoordinates, originCoordinateName, magneticDeviation, width / 2, height / 2, distanceCoeficient);
    
    //console.log(formattedCoordinatesToCartesion);

    let dimgi3AFormatted = dataFormatter.getFormattedRoute(dimgi3A, formattedCoordinatesToCartesion);
    let testRouteFormatted = dataFormatter.getFormattedRoute(testRoute, formattedCoordinatesToCartesion);
    //console.log(formattedRoute);

    drawer.drawRoute(dimgi3AFormatted, ctx, "red", 10);
    drawer.drawRoute(testRouteFormatted, ctx, "green", 10);


    ///////

    const dimgi = dimgi3AFormatted.route.dimgi;
    const vivzo = dimgi3AFormatted.route.vivzo

    const test1point = testRouteFormatted.route.test1;
    const test2point = testRouteFormatted.route.test2;

    const intersection = intersections.findIntersection(dimgi, vivzo, test1point, test2point);


    drawer.drawPoint(intersection, ctx);
    console.log(intersection)

}
)