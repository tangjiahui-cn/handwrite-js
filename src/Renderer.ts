/**
 * Renderer
 * 
 * @description render point to canvas.
 */
import { Point } from '.';
import drawBezierLine from './utils/drawBezierLine';

interface HandWriteOptions {
  color: string; // pen color
  size: number; // pen size
  background: string; // canvas background
}

export class Renderer {
  private lastPoint: Point | null = null;
  private pointList: Point[] = [];
  private canvasEl: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // use canvas.
  public use(canvas: HTMLCanvasElement) {
    this.canvasEl = canvas;
    this.ctx = canvas.getContext('2d');

    // set draw style.
    this.setStyle();
  }

  public add(point: Point) {
    this.pointList.push(point);
    this.flush();
  }

  public clear() {
    this.pointList = [];
    this.lastPoint = null;
  }

  public getPointList() {
    return this.pointList;
  }

  // render to canvas.
  private flush() {
    if (!this.ctx) {
      throw new Error('Please use the "use" method to set the canvas first');
    }

    if (!this.pointList.length) {
      return;
    }

    const [p1, p2] = this.pointList.slice(-2);
    const controlPoint = p1;
    const endPoint = p2
      ? {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        }
      : p1;
    drawBezierLine(this.lastPoint || p1, controlPoint, endPoint, this.ctx);
    this.lastPoint = endPoint;
  }

  private setStyle() {
    if (!this.canvasEl) {
      return;
    }

    // pen style options.
    const options: HandWriteOptions = { color: 'black', size: 5, background: 'white' };

    // set canvas style.
    this.canvasEl.style.border = '1px solid black';
    this.canvasEl.style.backgroundColor = options.background;

    // set ctx style.
    this.ctx = this.canvasEl.getContext('2d');
    this.ctx!.lineWidth = options.size;
    this.ctx!.strokeStyle = options.color;
    this.ctx!.lineJoin = 'round'; // 转折处圆形
    this.ctx!.lineCap = 'round'; // 末端圆形
  }
}
