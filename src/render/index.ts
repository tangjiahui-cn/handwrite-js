/**
 * bezier pointer render
 *
 * @author tangjiahui
 * @date 2024/5/15
 */
import { Point } from '../types';
import drawBezierLine from '../utils/drawBezierLine';

export default class BezierRender {
  private lastTime: number = 0;
  private points: Point[] = [];
  private ctx: CanvasRenderingContext2D;
  private startPoint: Point = null;

  public reset () {
    this.lastTime = 0;
    this.points = [];
    this.startPoint = null;
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.ctx = setCtxStyle(canvas.getContext('2d') as CanvasRenderingContext2D);
  }

  public addPoint(point: Point) {
    const now = Date.now();
    // 间隔时间
    const deltaTime = this.lastTime ? now - this.lastTime : 0;
    console.log('deltaTime: ', deltaTime);
    this.lastTime = now;
    this.points.push(point);
    this.flush();
  }

  private flush() {
    if (!this.points.length) {
      return;
    }
    const [p1, p2] = this.points.slice(-2);
    const controlPoint = p1;
    const endPoint = p2
      ? {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        }
      : p1;
    drawBezierLine(this.startPoint || p1, controlPoint, endPoint, this.ctx);
    this.startPoint = endPoint;
  }
}

// 设置ctx样式
function setCtxStyle(ctx) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round'; // 转折处圆形
  ctx.lineCap = 'round'; // 末端圆形
  return ctx;
}
