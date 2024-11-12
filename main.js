import * as dataFormatter from './modules/dataFormatter.js'
import * as drawer from './modules/drawer.js'
import { findIntersectionBetweenRoutes } from './modules/routessIntersectionFinder.js';


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
    points: {
        test1: "280",
        test2: "270",
        test3: "260",
        test4: "250",
        test5: "240",
        test6: "200",
    }
}

const dimgi3A = {
    name: "dimgi3A",
    points: {
        dimgi: "280",
        vivzo: "270",
        mefed: "260",
        logpu: "240",
        duzev: "220",
        otsur: "200",
        gekla: "190",
        enmur: "150-160",
        kibur: "150",
        lo: "140",
        bemas: "130",
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

    drawer.drawRoute(dimgi3AFormatted, ctx, "red", 10);
    drawer.drawRoute(testRouteFormatted, ctx, "green", 10);

    const intersections = findIntersectionBetweenRoutes(dimgi3AFormatted, testRouteFormatted);

    console.log(intersections);

    intersections.forEach(intersection => { drawer.drawPoint(intersection, ctx) });


}
)