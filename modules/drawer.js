export const name = "drawer";

const pointWidth = 25;
const pointHeight = 25;

export function drawRoute(routeData, canvasContext, color, width) {
  const { points } = routeData;

  if (Object.keys(points).length == 0) {
    console.error(`Can't draw a route! There are no points for ${routeData.name} route!`);
    return null;
  }

  canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = width;

  Object.values(points).forEach((point, index) => {
    if (index == 0) {
      canvasContext.moveTo(point.x, point.y);
    } else {
      canvasContext.lineTo(point.x, point.y);
    }
  });
  canvasContext.stroke();
}

export function drawPoints(route, canvasContext, fillColor, strokeColor, strokeWidth) {
  const drawnPoints = [];
  const { points } = route;

  canvasContext.fillStyle = fillColor;
  canvasContext.strokeStyle = strokeColor;
  canvasContext.lineWidth = strokeWidth;

  if (Object.keys(points).length == 0) {
    console.error(`Can't draw points for a route! There are no points for ${routeData.name} route!`);
    return null;
  }

  Object.values(points).forEach((point) => {
    drawnPoints.push(drawPointAsPath(point, canvasContext));
  });

  return drawnPoints;
}

export function drawPoint(pointCoordinates, canvasContext) {
  return canvasContext.fillRect(
    pointCoordinates.x - pointWidth / 2,
    pointCoordinates.y - pointHeight / 2,
    pointWidth,
    pointHeight
  );
}



function drawPointAsPath(point, canvasContext) {
  const path = new Path2D();
  path.rect(
    point.x - pointWidth / 2,
    point.y - pointHeight / 2,
    pointWidth,
    pointHeight
  );
  canvasContext.stroke(path);
  canvasContext.fill(path);
  point.path = path;
  return point;
}

function drawText(pointName, point, canvasContext) {
  canvasContext.font = "48px serif";
  canvasContext.fillText(pointName + ` [${point.z}]`, point.x, point.y);
}
