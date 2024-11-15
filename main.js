import * as dataFormatter from "./modules/dataFormatter.js";
import * as drawer from "./modules/drawer.js";
import * as routes from "./routes.js";
import { getRandomColor } from "./modules/randomColorGenerator.js";

const coordinatesTable = document.getElementById("coordinates-table");

const width = 4000;
const height = 4000;

const pointsCanvas = document.getElementById("points-canvas");
const pointsCanvasContext = pointsCanvas.getContext("2d");
const routesCanvas = document.getElementById("lines-canvas");
const routesCanvasContext = routesCanvas.getContext("2d");

pointsCanvasContext.canvas.height = height;
pointsCanvasContext.canvas.width = width;

routesCanvasContext.canvas.height = height;
routesCanvasContext.canvas.width = width;

const distanceCoeficient = 100;

const magneticDeviation = -11;

const originCoordinateName = "rw06";

dataFormatter.getCoordinatesData().then((rawCoordinatesData) => {
  let formattedCoordinates =
    dataFormatter.getformatedCoordinates(rawCoordinatesData);
  //console.log(formattedCoordinates);

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
  standartRoutes.forEach((route) => {
    const formattedRoute = dataFormatter.getFormattedRoute(
      route,
      formattedCoordinatesToCartesion
    );

    const randomColor = getRandomColor();

    const drawPoints = () =>
      drawer.drawPoints(
        formattedRoute,
        pointsCanvasContext,
        randomColor,
        "black",
        10
      );

    const drawRoute = () =>
      drawer.drawRoute(formattedRoute, routesCanvasContext, randomColor, 10);

    drawPoints();
    drawRoute();

    drawFunctions.push(...[drawPoints, drawRoute]);
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

  const testPoints = drawTestPoints();
  drawTestRoute();

  dragPoint(
    testPoints,
    pointsCanvas,
    [pointsCanvas, routesCanvas],
    [...drawFunctions, drawTestRoute, drawTestPoints],
    formattedTestRoute.points
  );
});

function dragPoint(
  points,
  pointsCanvas,
  otherCanvases,
  redrawFunctions,
  formattedPoins
) {
  const pointsCanvasContext = pointsCanvas.getContext("2d");
  let selectedPoint = undefined;

  pointsCanvas.addEventListener("mousedown", (event) => {
    //On right click reset point
    if (event.which == 3) {
      selectedPoint = undefined;
    }

    const x = event.offsetX;
    const y = event.offsetY;

    if (!selectedPoint) {
      for (const point of points) {
        const pointPath = point.path;
        if (
          pointsCanvasContext.isPointInPath(pointPath, x, y) ||
          pointsCanvasContext.isPointInStroke(pointPath, x, y)
        ) {
          console.log(`Selected point ${point.name}!`, point);
          selectedPoint = point;
          break;
        }
      }
    } else {
      formattedPoins[selectedPoint.name].x = x;
      formattedPoins[selectedPoint.name].y = y;
      cleanCanvases([pointsCanvas, ...otherCanvases]);
      redrawFunctions.forEach((func) => {
        func();
      });
      selectedPoint = undefined;
    }
  });
}

function cleanCanvases(canvases) {
  canvases.forEach((canvas) => {
    cleanCanvas(canvas);
  });
}

function cleanCanvas(canvas) {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
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
