import * as dataFormatter from "./modules/dataFormatter.js";
import * as drawer from "./modules/drawer.js";
import { findIntersectionBetweenRoutes } from "./modules/routessIntersectionFinder.js";

const coordinatesTable = document.getElementById("coordinates-table");

var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;

const ctx = canvas.getContext("2d");

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

  const drawnPointsForDimgi = drawer.drawRoute(
    dimgi3AFormatted,
    ctx,
    "red",
    10
  );
  drawer.drawRoute(testRouteFormatted, ctx, "green", 10);

  const intersections = findIntersectionBetweenRoutes(
    dimgi3AFormatted,
    testRouteFormatted
  );

  //console.log(intersections);

  intersections.forEach((intersection) => {
    drawer.drawPoint(intersection, ctx);
  });

  canvas.addEventListener("click", (event) => {
    const isPointInPath = ctx.isPointInPath(
      drawnPointsForDimgi[0],
      event.offsetX,
      event.offsetY
    );

    const isPointInStroke = ctx.isPointInStroke(
      drawnPointsForDimgi[0],
      event.offsetX,
      event.offsetY
    );

    if (isPointInPath || isPointInStroke) {
      console.log(drawnPointsForDimgi[0]);
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    drawer.drawPoint({x : event.offsetX, y : event.offsetY}, ctx);
  });

  addCoordinatesToTable(coordinatesTable, formattedCoordinates);
});

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
