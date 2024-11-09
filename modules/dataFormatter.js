import { calculateBearingAndDistance } from "./bearingAndDistanceCalculations.js";
export const name = "dataFormatter";

const coordinatesFilePath = "coordinates.txt";

export async function getCoordinatesData() {
    const responce = await fetch(coordinatesFilePath);
    const coordinatesRawData = (await responce.text()).split('\n');
    return coordinatesRawData;
}

export function getformatedCoordinates(coordinatesRawData) {
    let formattedCoordinates = {};
    coordinatesRawData.forEach(coordinate => {
        let splitted = coordinate.split(' ');

        //Make a coordinate 
        //{
        // name : {
        // latitude : XXXXXX 
        // longitude : YYYYYY
        //}}

        formattedCoordinates[splitted[0].toLowerCase()] = {
            latitude: splitted[1].slice(0, -1),
            longitude: splitted[2].slice(0, -1)
        }
    });
    return formattedCoordinates;
}

export function getformatedCoordinatesToCartesion(formattedCoordinates, originCoordinateName, magneticDeviation, xOffset, yOffset, distanceCoeficient) {
    //For each coordinate
    //Calculate distance and bearing from originCoordinate
    //then calculate relative X and Y Cartesion coordinate
    let formattedCoordinatesToCartesion = {};
    let originCoordinate = getCoordinate(originCoordinateName, formattedCoordinates);

    for (const coordinateKey in formattedCoordinates) {
        let bearingAndDistance = calculateBearingAndDistance(originCoordinate, formattedCoordinates[coordinateKey], magneticDeviation);
        let coordinates = getCartesionCoordinates(bearingAndDistance, distanceCoeficient, xOffset, yOffset);
        formattedCoordinatesToCartesion[coordinateKey] = coordinates;
    }
    return formattedCoordinatesToCartesion;
}

export function getFormattedRoute(routeData, formattedCoordinatesToCartesion) {
    const fullRouteInfo = {
        name: routeData.name,
        route: {}
    };

    const { route } = routeData;

    for (const pointName in route) {
        const altitudeInfo = route[pointName].split("-");
        if (altitudeInfo.length == 1) {
            //get X and Y for a point
            //Then add Z coordinate
            const coordinates = formattedCoordinatesToCartesion[pointName];
            coordinates.z = +altitudeInfo[0];

            fullRouteInfo.route[pointName] = coordinates;
            continue;
        }

        //We can get a range of altitudes for a point
        //In such case we format them like {x : val, y : val, z : val, z1 : val};
        const coordinates = formattedCoordinatesToCartesion[pointName];

        altitudeInfo.forEach((altitude, index) => {
            if(index == 0)
            {
                coordinates.z = +altitude;
            }
            coordinates[`z` + `${index}`] = +altitude;
        })
        fullRouteInfo.route[pointName] = coordinates;
    }

    return fullRouteInfo;
}

function getCoordinate(coordinateName, coordiantes) {

    let coordinate = coordiantes[coordinateName]

    if (!coordinate) {
        console.warn(`Can't find point ${coordinateName} in the coordinates list!`);
        return undefined;
    }

    return coordinate;
}


function getCartesionCoordinates(bearingAndDistance, distanceCoeficient, xOffset, yOffset) {
    let radians = (bearingAndDistance.magneticBearing - 90) * (Math.PI / 180);
    let distance = bearingAndDistance.distance / distanceCoeficient;
    let x = xOffset + distance * Math.cos(radians);
    let y = yOffset + distance * Math.sin(radians);

    return { x: Math.round(x), y: Math.round(y) };
}
