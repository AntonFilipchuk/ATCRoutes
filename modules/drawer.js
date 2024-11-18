export const name = "drawer";

const pointWidth = 25;
const pointHeight = 25;

export function drawRoute(routeData, canvasContext, color, width) {
  const { points } = routeData;

  if (Object.keys(points).length == 0) {
    console.error(
      `Can't draw a route! There are no points for ${routeData.name} route!`
    );
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

export function drawPoints(
  route,
  canvasContext,
  fillColor,
  strokeColor,
  strokeWidth
) {
  const drawnPoints = [];
  const { points } = route;

  canvasContext.fillStyle = fillColor;
  canvasContext.strokeStyle = strokeColor;
  canvasContext.lineWidth = strokeWidth;

  if (Object.keys(points).length == 0) {
    console.error(
      `Can't draw points for a route! There are no points for ${routeData.name} route!`
    );
    return null;
  }

  Object.values(points).forEach((point) => {
    drawnPoints.push(drawPointAsPath(point, canvasContext));
  });

  return drawnPoints;
}

export function drawPoint(
  pointCoordinates,
  canvasContext,
  fillColor,
  strokeColor
) {
  canvasContext.fillStyle = fillColor;
  canvasContext.strokeStyle = strokeColor;

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

export function drawPointsNamesForRoute(
  route,
  canvasContext,
  strokeColor,
  fillColor,
  font,
  width
) {
  const points = route.points;

  Object.values(points).forEach((point) => {
    drawTextForNamedPoint(
      point,
      canvasContext,
      strokeColor,
      fillColor,
      font,
      width
    );
  });
}

export function drawTextForNamedPoint(
  point,
  canvasContext,
  strokeColor,
  fillColor,
  font,
  width
) {
  canvasContext.strokeStyle = strokeColor;
  canvasContext.fillStyle = fillColor;
  canvasContext.font = font;
  canvasContext.lineWidth = width;
  canvasContext.fillText(
    point.name + ` [${point.z}]`,
    point.x + (point.x / 100) * 2,
    point.y + (point.y / 100) * 2
  );
  canvasContext.strokeText(
    point.name + ` [${point.z}]`,
    point.x + (point.x / 100) * 2,
    point.y + (point.y / 100) * 2
  );
}

export function drawText(
  text,
  point,
  canvasContext,
  strokeColor = "black",
  fillColor = "black",
  font = "Calibri",
  fontSize = "52px",
  width = 2
) {
  canvasContext.strokeStyle = strokeColor;
  canvasContext.fillStyle = fillColor;
  canvasContext.font = `${fontSize} ${font}`;
  canvasContext.lineWidth = width;
  canvasContext.fillText(
    text,
    point.x + (point.x / 100) * 2,
    point.y + (point.y / 100) * 2
  );
  canvasContext.strokeText(
    text,
    point.x + (point.x / 100) * 2,
    point.y + (point.y / 100) * 2
  );
}
