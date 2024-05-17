/**
 * bezier pointer render
 *
 * @author tangjiahui
 * @date 2024/5/15
 * @description render pointer to canvas.
 */
import { Point } from '../types';
import drawBezierLine from '../utils/drawBezierLine';
import DataFunneling from '../utils/dataFunneling';
import getPointDistance from '../utils/getPointDistance';
import getTargetWidth from '../utils/getTargetWidth';

const TRANSITION_RATE = 0.18; // 衰变率 (0 - 1) // 值越小越光滑，但需要采集点数更多

const MAX_WIDTH = 10; // 最大宽度
const MIN_WIDTH = 2; // 最小宽度
const MAX_SPEED = 3; // 最大速度
const MIN_SPEED = 0.1; // 最小速度
const WIDTH_PER_SPEED = (MAX_WIDTH - MIN_WIDTH) / (MAX_SPEED - MIN_SPEED); // 单位速度的宽度

/**
 * （1）线条光滑度：宽度变化率（宽度单位时间内变化越小越光滑）
 * （2）笔锋效果：速度很大时，线条宽度变化率很大
 * （3）画笔：钢笔、签字笔、毛笔、圆珠笔
 * （4）画笔颜色：自定义、运行时指定线段颜色、随机生成色
 */

interface RenderPoint extends Point {
  speed: number;
}

export default class BezierRender {
  private lastTime: number = 0;
  private points: RenderPoint[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private startPoint: Point | null = null;
  private dataFunneling: DataFunneling<RenderPoint>;

  private lastPoint: Point | null = null;
  // 上次绘制宽度
  private lastWidth: number = 0;

  constructor() {
    this.dataFunneling = new DataFunneling<RenderPoint>({
      interval: 10, // 间隔时间采集一次点
    });

    this.dataFunneling.on((point) => {
      // 间隔时间
      const now = Date.now();
      const moveTime = this.lastTime ? now - this.lastTime : 0;
      const moveDistance: number = this.lastPoint ? getPointDistance(this.lastPoint, point) : 0;
      const speed = moveTime ? moveDistance / moveTime : 0;

      let expectWidth: number; // 期待画笔宽度
      if (speed && speed <= MIN_SPEED) {
        expectWidth = MAX_WIDTH;
        // console.log('每毫秒移动像素 --->', speed, expectWidth, '最慢');
      } else if (speed >= MAX_SPEED) {
        expectWidth = MIN_WIDTH;
        // console.log('每毫秒移动像素 --->', speed, expectWidth, '最快');
      } else {
        expectWidth = MIN_WIDTH + (MAX_SPEED - speed) * WIDTH_PER_SPEED;
        // console.log('每毫秒移动像素 --->', speed, expectWidth);
      }

      // 真实绘制宽度
      const targetWidth = getTargetWidth(expectWidth, this.lastWidth, TRANSITION_RATE);
      this.setCtxStyle((this.lastWidth = targetWidth));

      // point.speed = speed;
      this.points.push(point);
      this.flush();

      this.lastPoint = point;
      this.lastTime = now;
    });
  }

  public reset() {
    this.lastWidth = 0;
    this.lastPoint = null;

    this.lastTime = 0;
    this.points = [];
    this.startPoint = null;
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.setCtxStyle(2);
  }

  public addPoint(point: Point) {
    if (!this.lastPoint) {
      console.log('--------------------');
    }
    this.dataFunneling.add({
      ...point,
      speed: 0,
    });
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

    // // 绘制单个点
    // if (!this.startPoint) {
    //   this.startPoint = endPoint;
    //   drawPoint(this.ctx, p1);
    //   return;
    // }

    if (this.ctx) {
      drawBezierLine(this.startPoint || p1, controlPoint, endPoint, this.ctx);
    }
    this.startPoint = endPoint;
  }

  setCtxStyle(width: number) {
    if (!this.ctx) return;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineJoin = 'round'; // 转折处圆形
    this.ctx.lineCap = 'round'; // 末端圆形
    this.ctx.lineWidth = width;
  }
}
