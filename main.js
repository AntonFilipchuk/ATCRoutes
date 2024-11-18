import * as dataFormatter from "./modules/dataFormatter.js";
import * as drawer from "./modules/drawer.js";
import * as routes from "./routes.js";
import * as canvas from "./modules/canvas.js";
import { getRandomColor } from "./modules/randomColorGenerator.js";
import {
  findIntersectionBetween2Routes,
  findIntersectionsBetweenAllRoutes,
} from "./modules/routesIntersectionFinder.js";

const coordinatesTable = document.getElementById("coordinates-table");

const width = 4000;
const height = 4000;

const pointsCanvas = document.getElementById("points-canvas");
const routesCanvas = document.getElementById("lines-canvas");
const textCanvas = document.getElementById("text-canvas");
const pointsCanvasContext = pointsCanvas.getContext("2d");
const routesCanvasContext = routesCanvas.getContext("2d");
const textCanvasContext = textCanvas.getContext("2d");

setCanvasesDimensions(
  [pointsCanvasContext, routesCanvasContext, textCanvasContext],
  width,
  height
);

const distanceCoeficient = 100;

const magneticDeviation = -11;

const originCoordinateName = "rw06";

dataFormatter.getCoordinatesData().then((rawCoordinatesData) => {
  let formattedCoordinates =
    dataFormatter.getformatedCoordinates(rawCoordinatesData);

  let formattedCoordinatesToCartesion =
    dataFormatter.getformatedCoordinatesToCartesion(
      formattedCoordinates,
      originCoordinateName,
      magneticDeviation,
      width / 2,
      height / 2,
      distanceCoeficient
    );

  const drawFunctions = [];
  const standartRoutes = routes.getStandartRoutes();
  const formattedRoutes = standartRoutes.map((route) => {
    return dataFormatter.getFormattedRoute(
      route,
      formattedCoordinatesToCartesion
    );
  });

  formattedRoutes.forEach((route) => {
    const randomColor = getRandomColor();

    const drawPoints = () =>
      drawer.drawPoints(route, pointsCanvasContext, randomColor, "black", 10);

    const drawRoute = () =>
      drawer.drawRoute(route, routesCanvasContext, randomColor, 10);

    const drawText = () => {
      drawer.drawPointsNamesForRoute(
        route,
        textCanvasContext,
        "black",
        randomColor,
        "52px Calibri",
        2
      );
    };

    drawText();
    drawPoints();
    drawRoute();

    drawFunctions.push(...[drawPoints, drawRoute, drawText]);
  });

  const testRoute = routes.testRoute;

  const formattedTestRoute = dataFormatter.getFormattedRoute(
    testRoute,
    formattedCoordinatesToCartesion
  );

  const drawTestPoints = () => {
    return drawer.drawPoints(
      formattedTestRoute,
      pointsCanvasContext,
      "green",
      "black",
      10
    );
  };

  const drawTestRoute = () => {
    drawer.drawRoute(formattedTestRoute, routesCanvasContext, "green", 10);
  };

  const drawTestRouteText = () => {
    drawer.drawPointsNamesForRoute(
      formattedTestRoute,
      textCanvasContext,
      "green",
      "black",
      "52px Calibri",
      2
    );
  };

  const testPoints = drawTestPoints();
  drawTestRoute();
  drawTestRouteText();

  const redrawCanvases = () => {
    canvas.redrawCanvases([
      ...drawFunctions,
      drawTestRoute,
      drawTestPoints,
      drawTestRouteText,
    ]);
  };

  const cleanCanvases = () => {
    canvas.cleanCanvases([pointsCanvas, routesCanvas, textCanvas]);
  };

  const drawIntersectionPoints = (intersectionsArray) => {
    intersectionsArray.forEach((intersections) => {
      //TODO FIX color
      pointsCanvasContext.strokeStyle = "black";
      pointsCanvasContext.fillStyle = "red";
      pointsCanvasContext.lineWidth = 5;
      Object.values(intersections).forEach((point) => {
        drawer.drawPoint(point, pointsCanvasContext, "red", "black");
      });
    });
  };

  const drawIntersectionPointsText = (intersectionsArray) => {
    intersectionsArray.forEach((intersections) => {
      intersections.forEach((point) => {
        drawer.drawText(`[${point.z}]`, point, pointsCanvasContext);
      });
    });
  };

  const drawIntersectionPointsAndText = () => {
    const intersectionsArray = findIntersectionsBetweenAllRoutes(
      formattedRoutes,
      formattedTestRoute
    );
    drawIntersectionPoints(intersectionsArray);
    drawIntersectionPointsText(intersectionsArray);
  };

  drawIntersectionPointsAndText();

  drawFunctions.push(drawIntersectionPointsAndText);

  enableDragPointForRoute(
    testPoints,
    pointsCanvasContext,
    formattedTestRoute.points,
    redrawCanvases,
    cleanCanvases
  );
});

function enableDragPointForRoute(
  routePointsAsPath2d,
  pointsCanvasContext,
  formattedPoints,
  redrawCanvasesFunction,
  cleanCanvasesFunction
) {
  let selectedPoint = undefined;
  pointsCanvas.addEventListener("mousedown", (event) => {
    selectedPoint = canvas.dragPoint(
      event,
      selectedPoint,
      routePointsAsPath2d,
      pointsCanvasContext,
      redrawCanvasesFunction,
      cleanCanvasesFunction,
      formattedPoints
    );
  });
}

function setCanvasesDimensions(canvasContexts, width, height) {
  canvasContexts.forEach((canvasContext) => {
    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;
  });
}

function addCoordinatesToTable(table, coordinates) {
  const tbody = table.getElementsByTagName("tbody")[0];
  for (const coordinateName in coordinates) {
    const coordinate = coordinates[coordinateName];
    const row = tbody.insertRow();
    row.id = coordinateName;
    const nameCell = row.insertCell(0);
    const latitudeCell = row.insertCell(1);
    const longitudeCell = row.insertCell(2);
    const name = document.createTextNode(coordinateName);
    const latitude = document.createTextNode(coordinate.latitude);
    const longitude = document.createTextNode(coordinate.longitude);
    nameCell.appendChild(name);
    latitudeCell.appendChild(latitude);
    longitudeCell.appendChild(longitude);
    addActionsButtons(row);
  }
}

function addActionsButtons(row) {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("coordinates-buttons-container");
  const editCoordinateButton = document.createElement("button");
  const deleteCoordinateButton = document.createElement("button");

  editCoordinateButton.classList.add("edit-coordinate-button");
  deleteCoordinateButton.classList.add("delete-coordinate-button");

  editCoordinateButton.id = `edit-${row.id}`;
  deleteCoordinateButton.id = `delete-${row.id}`;

  editCoordinateButton.innerHTML = "Edit";
  deleteCoordinateButton.innerHTML = "Detele";

  buttonsContainer.appendChild(editCoordinateButton);
  buttonsContainer.appendChild(deleteCoordinateButton);
  const buttonsCell = row.insertCell();
  buttonsCell.appendChild(buttonsContainer);
}
