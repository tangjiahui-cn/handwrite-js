/**
 * Renderer
 *
 * @description render point to canvas.
 */
import type { Point } from '.';
import drawBezierLine from './utils/drawBezierLine';
import { getImgFromUrl } from './utils/getImgFromUrl';

export interface PenAttributes {
  size: number;
  color: string;
}

export const INIT_PEN_ATTRIBUTES: PenAttributes = {
  color: '#000',
  size: 4,
};

export class Renderer {
  private lastPoint: Point | null = null;
  private pointList: Point[] = [];
  private canvasEl: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  public init(canvas: HTMLCanvasElement) {
    this.canvasEl = canvas;
    this.ctx = canvas.getContext('2d');

    /** 设置绘制样式 */
    this.setStyle();
  }

  /** 添加点 */
  public addPoint(point: Point) {
    this.pointList.push(point);
    this.flush();
  }

  /** 清空点 */
  public clearPoint() {
    this.pointList = [];
    this.lastPoint = null;
  }

  /** 清空渲染 */
  public clear() {
    this.clearPoint();
    this.setBackground();
  }

  /** 设置base64对应内容到页面 */
  public setBase64(base64: string) {
    getImgFromUrl(base64).then((img) => {
      this.ctx?.drawImage(img, 0, 0);
    });
  }

  /** 设置画板背景色 */
  public setBackground(bgColor?: string) {
    if (!this.canvasEl) return;
    if (bgColor) {
      this.ctx!.fillStyle = bgColor;
    }
    this.ctx!.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  /** 设置画笔属性 */
  public setPen(attributes: Partial<PenAttributes>) {
    if (attributes?.size) {
      this.ctx!.lineWidth = attributes.size;
    }
    if (attributes?.color) {
      this.ctx!.strokeStyle = attributes.color;
    }
  }

  /** 绘制 */
  private flush() {
    if (!this.ctx) {
      throw new Error('Please use the "use" method to set the canvas at first.');
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

  /** 设置绘制样式 */
  private setStyle() {
    if (!this.canvasEl) {
      return;
    }

    this.ctx = this.canvasEl.getContext('2d');
    this.ctx!.lineJoin = 'round'; // 转折处圆形
    this.ctx!.lineCap = 'round'; // 末端圆形
    this.setBackground('white');
    this.setPen(INIT_PEN_ATTRIBUTES);
  }
}
