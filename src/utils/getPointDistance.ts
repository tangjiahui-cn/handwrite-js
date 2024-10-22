import type { Point } from '..';

export default function getPointDistance(point1: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
