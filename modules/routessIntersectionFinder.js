import { findIntersection } from './intersections.js';

export const name = "routesIntersectionFinder";

//routre data sould be converted 
export function findIntersectionBetweenRoutes(route1, route2) {
    //We need to check each segment of one path with
    //every segment of another path

    if (route1.name === route2.name) {
        console.error(`Trying to check intersections for the same route ${route1.name}!`);
        return undefined;
    }

    const points1Array = Object.keys(route1.points);
    const points2Array = Object.keys(route2.points);

    if (points1Array.length == 0 || points2Array.length == 0) {
        console.error(`Can't calculate intersections, no points for one or more route!`);
        return undefined;
    }

    points1Array.forEach((point, index) => {
        if (index == points1Array.length - 1) {
            return;
        }

        const firstPointOfSegment = route1.points[point];
        const secondPointOfSegment = route1.points[points1Array[index + 1]];

        points2Array.forEach((pointSecondRoute, indexSecondRoute) => {
            if (indexSecondRoute == points2Array.length - 1) {
                return;
            }

            const firstPointOfSegment_ = route2.points[pointSecondRoute];
            const secondPointOfSegment_ = route2.points[points2Array[indexSecondRoute + 1]];

            //console.log(firstPointOfSegment, secondPointOfSegment, firstPointOfSegment_, secondPointOfSegment_);
            
            console.log(findIntersection(firstPointOfSegment, secondPointOfSegment, firstPointOfSegment_, secondPointOfSegment_));
        })
    });
}

// export function findIntersection1(point1, point2, point3, point4) {
//     findIntersection()
// }

