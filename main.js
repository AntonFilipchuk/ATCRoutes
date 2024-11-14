import * as dataFormatter from "./modules/dataFormatter.js";
import * as drawer from "./modules/drawer.js";
import { findIntersectionBetweenRoutes } from "./modules/routessIntersectionFinder.js";

const coordinatesTable = document.getElementById("coordinates-table");

const width = 4000;
const height = 4000;

const pointsCanvas = document.getElementById("points-canvas");
const pointsCanvasContext = pointsCanvas.getContext("2d");
const routesCanvasContext = document
  .getElementById("lines-canvas")
  .getContext("2d");
console.log(pointsCanvasContext);

pointsCanvasContext.canvas.height = height;
pointsCanvasContext.canvas.width = width;

routesCanvasContext.canvas.height = height;
routesCanvasContext.canvas.width = width;
// const width = pointsCanvas.width;
// const height = pointsCanvas.height;

//const ctx = pointsCanvas.getContext("2d");

const distanceCoeficient = 100;

const magneticDeviation = -11;

const originCoordinateName = "rw06";
const path = [
  "dimgi",
  "vivzo",
  "mefed",
  "logpu",
  "duzev",
  "otsur",
  "gekla",
  "enmur",
  "kibur",
  "lo",
  "bemas",
  "tebdi",
  "tepta",
  "fidot",
  "roruk",
];
const path1 = [
  "emgas",
  "lazit",
  "riren",
  "ofira",
  "somag",
  "roruk",
  "ww058",
  "ww192",
  "ww191",
];

const testRoute = {
  name: "test",
  points: {
    test1: "280",
    test2: "270",
    test3: "260",
    test4: "250",
    test5: "240",
    test6: "200",
  },
};

const dimgi3A = {
  name: "dimgi3A",
  points: {
    dimgi: "280",
    vivzo: "270",
    mefed: "260",
    logpu: "240",
    duzev: "220",
    otsur: "200",
    gekla: "190",
    enmur: "150-160",
    kibur: "150",
    lo: "140",
    bemas: "130",
    tebdi: "100",
    tepta: "80",
    fidot: "70",
    roruk: "60",
  },
};

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

  //console.log(formattedCoordinatesToCartesion);

  let dimgi3AFormatted = dataFormatter.getFormattedRoute(
    dimgi3A,
    formattedCoordinatesToCartesion
  );
  let testRouteFormatted = dataFormatter.getFormattedRoute(
    testRoute,
    formattedCoordinatesToCartesion
  );

  let dimgiPoints = drawer.drawPoints(
    dimgi3AFormatted,
    pointsCanvasContext,
    "red",
    "black",
    10
  );
  drawer.drawRoute(dimgi3AFormatted, routesCanvasContext, "red", 10);

  const testPoints = drawer.drawPoints(
    testRouteFormatted,
    pointsCanvasContext,
    "green",
    "black",
    10
  );
  drawer.drawRoute(testRouteFormatted, routesCanvasContext, "green", 10);

  dragPoint(
    dimgiPoints,
    pointsCanvas,
    pointsCanvasContext,
    () => {
      dimgiPoints = drawer.drawPoints(
        dimgi3AFormatted,
        pointsCanvasContext,
        "red",
        "black",
        10
      );
    },
    dimgi3AFormatted.points
  );
  // pointsCanvas.addEventListener("mousedown", (event) => {
  //   draggablePoint(event, dimgiPoints[0], pointsCanvasContext);
  // });
});

function dragPoint(points, canvas, ctx, drawPoints, formattedPoins) {
  console.log(formattedPoins);

  let selectedPoint = undefined;

  canvas.addEventListener("mousedown", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    if (!selectedPoint) {
      for (const point of points) {
        const pointPath = point.path;
        if (
          ctx.isPointInPath(pointPath, x, y) ||
          ctx.isPointInStroke(pointPath, x, y)
        ) {
          console.log(`Selected point ${point.name}!`, point);
          selectedPoint = point;
          break;
        }
      }
    } else {
      console.log(selectedPoint);

      formattedPoins[selectedPoint.name].x = x;
      formattedPoins[selectedPoint.name].y = y;
      selectedPoint = undefined;
      ctx.clearRect(0, 0, width, height);
      drawPoints();
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (selectedPoint) {
    }
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
