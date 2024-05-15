/**
 * SignatureMobile
 *
 * @author tangjiahui
 * @date 2024/5/14
 * @description mobile executor
 */
import type { SignatureExecutor } from '../types';
import drawBezierLine from '../utils/drawBezierLine';

export class MobileExecutor implements SignatureExecutor {
  private _points: Array<{ x: number; y: number }> = [];
  private _startPoint: { x: number; y: number } = null;
  private _isDrawFinish: boolean = false;
  private _canvasRect: DOMRect;

  private _unmount: () => void;

  public setCanvas(canvas: HTMLCanvasElement) {
    let handleStart;
    const that = this;
    const ctx: CanvasRenderingContext2D = setCtxStyle(canvas.getContext('2d'));
    this._canvasRect = canvas.getBoundingClientRect();
    canvas.addEventListener(
      'touchstart',
      (handleStart = (e) => {
        const pos = that.getPos(e);
        that._points.push((that._startPoint = pos));
        canvas.addEventListener('touchmove', handleMove);
        canvas.addEventListener('touchend', handleEnd);
      }),
    );

    function handleMove(e) {
      that._points.push(that.getPos(e));
      if (that._points.length > 3) {
        const [p1, p2] = that._points.slice(-2);
        const controlPoint = p1;
        const endPoint = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };
        drawBezierLine(that._startPoint, controlPoint, endPoint, ctx);
        that._startPoint = endPoint;
      }

      e?.preventDefault?.();
    }

    function handleEnd(e) {
      that._isDrawFinish = true;
      that._points.push(that.getPos(e));

      if (that._points.length > 3) {
        const [controlPoint, endPoint] = that._points.slice(-2);
        drawBezierLine(that._startPoint, controlPoint, endPoint, ctx);
      }

      that._startPoint = null;
      that._points = [];
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerup', handleEnd);
    }

    this._unmount = () => {
      canvas.removeEventListener('touchstart', handleStart);
    };
  }

  public destroy() {
    this._unmount?.();
  }

  private getPos(e) {
    e = e.touches?.[0];
    return {
      x: e?.clientX - (this._canvasRect?.x || 0),
      y: e?.clientY - (this._canvasRect?.y || 0),
    };
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
