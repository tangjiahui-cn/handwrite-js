/**
 * draw bezier line
 *
 * @author tangjiauhi
 * @date 2024/5/14
 */
import { Point } from '../types';

export default function drawBezierLine(
  startPoint: Point,
  controlPoint: Point,
  endPoint: Point,
  ctx: CanvasRenderingContext2D,
) {
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
  ctx.stroke();
}
