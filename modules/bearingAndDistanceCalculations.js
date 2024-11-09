export const name = "bearingAndDistanceCalculations";

//Coordinate info
//{
// name : {
// latitude : XXXXXX 
// longitude  : YYYYYY
//}}

function parseCoordinate(coord, isLatitude = true) {
    const degrees = isLatitude ? parseInt(coord.slice(0, 2)) : parseInt(coord.slice(0, 3));
    const minutes = isLatitude ? parseInt(coord.slice(2, 4)) : parseInt(coord.slice(3, 5));
    const seconds = isLatitude ? parseFloat(coord.slice(4)) : parseFloat(coord.slice(5));
    return degrees + (minutes / 60) + (seconds / 3600);
}

export function calculateBearingAndDistance(coor1, coor2, magneticDeviation = 0) {
    const lat1 = parseCoordinate(coor1.latitude, true)
    const lon1 = parseCoordinate(coor1.longitude, false)
    const lat2 = parseCoordinate(coor2.latitude, true)
    const lon2 = parseCoordinate(coor2.longitude, false)


    const R = 6371e3; // Earth's radius in meters

    // Convert latitude and longitude from degrees to radians
    const f1 = lat1 * Math.PI / 180;
    const f2 = lat2 * Math.PI / 180;
    const deltaF = (lat2 - lat1) * Math.PI / 180;
    const deltaL = (lon2 - lon1) * Math.PI / 180;

    // Haversine formula for distance
    const a = Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
        Math.cos(f1) * Math.cos(f2) *
        Math.sin(deltaL / 2) * Math.sin(deltaL / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;


    // Formula for initial true bearing
    const y = Math.sin(deltaL) * Math.cos(f2);
    const x = Math.cos(f1) * Math.sin(f2) -
        Math.sin(f1) * Math.cos(f2) * Math.cos(deltaL);
    let trueBearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

    // Adjust bearing with magnetic deviation
    let magneticBearing = (trueBearing + magneticDeviation + 360) % 360;

    return { distance, trueBearing, magneticBearing };
}