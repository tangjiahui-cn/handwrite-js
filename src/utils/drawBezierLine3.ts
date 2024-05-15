/**
 * draw 3 times bezier line
 *
 * @author tangjiauhi
 * @date 2024/5/15
 */
import { Point } from '../types';

export default function drawBezierLine(
  startPoint: Point,
  controlPoint1: Point,
  controlPoint2: Point,
  endPoint: Point,
  ctx: CanvasRenderingContext2D,
) {
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.bezierCurveTo(
    controlPoint1.x,
    controlPoint1.y,
    controlPoint2.x,
    controlPoint2.y,
    endPoint.x,
    endPoint.y,
  );
  ctx.stroke();
}
