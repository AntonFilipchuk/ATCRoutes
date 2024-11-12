import { findIntersection } from './intersections.js';

export const name = "routesIntersectionFinder";

//routre data sould be converted
export function findIntersectionBetweenRoutes(route1, route2) {
    //We need to check each segment of one path with
    //every segment of another path

    const intersections = [];

    if (route1.name === route2.name) {
        console.error(`Trying to check intersections for the same route ${route1.name}!`);
        return undefined;
    }

    const pointsRoute1Names = Object.keys(route1.points);
    const pointsRoute2Names = Object.keys(route2.points);

    if (pointsRoute1Names.length == 0 || pointsRoute2Names.length == 0) {
        console.error(`Can't calculate intersections, no points for one or more route!`);
        return undefined;
    }

    pointsRoute1Names.forEach((pointNameRoute1, index) => {
        if (index == pointsRoute1Names.length - 1) {
            return;
        }

        const nextPointNameRoute1 = pointsRoute1Names[index + 1];

        const route1Point1 = route1.points[pointNameRoute1];
        const route1Point2 = route1.points[nextPointNameRoute1];

        pointsRoute2Names.forEach((pointNameRoute2, indexSecondRoute) => {
            if (indexSecondRoute == pointsRoute2Names.length - 1) {
                return;
            }

            const nextPointNameRoute2 = pointsRoute2Names[indexSecondRoute + 1];

            const route2Point1 = route2.points[pointNameRoute2];
            const route2Point2 = route2.points[nextPointNameRoute2];

            const intersection = findIntersection(route1Point1, route1Point2, route2Point1, route2Point2);
            

            if (intersection) {
                console.log(route1Point1,route1Point2,route2Point1,route2Point2)
                console.log(`Intersection found! \nRoute: ${route1.name} and ${route2.name} \nSegment: [${pointNameRoute1} - ${nextPointNameRoute1}] and [${pointNameRoute2} - ${nextPointNameRoute2}]`);
                intersections.push(intersection);
            }
        })
    });

    return intersections;
}





