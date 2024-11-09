export const name = "intersections";

// Function to find if lines intersect
export function findIntersection(p1, p2, q1, q2) {
    // Direction vectors for each line
    const d1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const d2 = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z };

    // Cross product of direction vectors
    const crossD1D2 = {
        x: d1.y * d2.z - d1.z * d2.y,
        y: d1.z * d2.x - d1.x * d2.z,
        z: d1.x * d2.y - d1.y * d2.x
    };

    // Check if the cross product is zero (i.e., the lines are parallel)
    if (crossD1D2.x === 0 && crossD1D2.y === 0 && crossD1D2.z === 0) {
        // Lines are parallel; check if they are collinear
        const p1ToQ1 = { x: q1.x - p1.x, y: q1.y - p1.y, z: q1.z - p1.z };
        const crossP1ToQ1D1 = {
            x: p1ToQ1.y * d1.z - p1ToQ1.z * d1.y,
            y: p1ToQ1.z * d1.x - p1ToQ1.x * d1.z,
            z: p1ToQ1.x * d1.y - p1ToQ1.y * d1.x
        };
        if (crossP1ToQ1D1.x === 0 && crossP1ToQ1D1.y === 0 && crossP1ToQ1D1.z === 0) {
            return "The lines are collinear and overlap";
        } else {
            return "The lines are parallel but do not intersect";
        }
    }

    // Lines are not parallel; solve for intersection
    // Calculate determinants
    const t = ((q1.x - p1.x) * d2.y - (q1.y - p1.y) * d2.x) / (d1.x * d2.y - d1.y * d2.x);
    const u = ((p1.x - q1.x) * d1.y - (p1.y - q1.y) * d1.x) / (d2.x * d1.y - d2.y * d1.x);

    // Calculate potential intersection points on each line
    const intersectP1 = {
        x: Math.round(p1.x + t * d1.x),
        y: Math.round(p1.y + t * d1.y),
        z: Math.round(p1.z + t * d1.z)
    };

    const intersectQ1 = {
        x: Math.round(q1.x + u * d2.x),
        y: Math.round(q1.y + u * d2.y),
        z: Math.round(q1.z + u * d2.z)
    };

    // Check if intersection points match
    if (
        Math.abs(intersectP1.x - intersectQ1.x) < 10 &&
        Math.abs(intersectP1.y - intersectQ1.y) < 10 &&
        Math.abs(intersectP1.z - intersectQ1.z) < 10
    ) {
        console.log("Intersection found");
        return intersectP1; // Intersection point
    } else {
        return "The lines do not intersect";
    }
}
