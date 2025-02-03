export default function drawBezierLine(startPoint, controlPoint1, controlPoint2, endPoint, ctx) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
}
