export const name = "drawer";

const pointWidth = 25;
const pointHeight = 25;

export function drawRoute(routeData, canvasContext, color, width) {
    const { points } = routeData;

    if(Object.keys(points).length == 0)
    {
        console.error(`There are no points for ${routeData.name} route!`);
        return undefined;
    }

    canvasContext.beginPath();
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = width;

    Object.values(points).forEach((point, index) => {        
        if (index == 0) {
            canvasContext.moveTo(point.x, point.y);
            drawPoint(point, canvasContext);
            drawText(Object.keys(points)[index], point, canvasContext)
        }
        else 
        {
            canvasContext.lineTo(point.x, point.y);
            drawPoint(point, canvasContext);
            drawText(Object.keys(points)[index], point, canvasContext)
        };
    });

    canvasContext.stroke();
}


export function drawPoint(pointCoordinates, canvasContext) {
    canvasContext.fillRect(
        pointCoordinates.x - pointWidth / 2,
        pointCoordinates.y - pointHeight / 2,
        pointWidth, pointHeight
    )
}

function drawText(pointName, point, canvasContext)
{
    canvasContext.font = "48px serif";
    canvasContext.fillText(pointName + ` [${point.z}]`, point.x, point.y);
}
