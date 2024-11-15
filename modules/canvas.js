export const name = "canvas";

export function dragPoint(
  mouseClickEvent,
  selectedPoint,
  routePointsAsPath2d,
  pointsCanvasContext,
  redrawCanvasesFunction,
  cleanCanvasesFunction,
  formattedRoutePoints
) {
  if (mouseClickEvent.which == 3) {
    return undefined;
  }
  const x = mouseClickEvent.offsetX;
  const y = mouseClickEvent.offsetY;

  if (!selectedPoint) {
    for (const point of routePointsAsPath2d) {
      const pointPath = point.path;
      if (
        pointsCanvasContext.isPointInPath(pointPath, x, y) ||
        pointsCanvasContext.isPointInStroke(pointPath, x, y)
      ) {
        return point;
      }
    }
  } else {
    formattedRoutePoints[selectedPoint.name].x = x;
    formattedRoutePoints[selectedPoint.name].y = y;
    cleanCanvasesFunction();
    redrawCanvasesFunction();
    return undefined;
  }
}

export function redrawCanvases(drawFunctionsArray) {
  drawFunctionsArray.forEach((func) => {
    func();
  });
}

export function cleanCanvases(canvases) {
  canvases.forEach((canvas) => {
    cleanCanvas(canvas);
  });
}

function cleanCanvas(canvas) {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}
