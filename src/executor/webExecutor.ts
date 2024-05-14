/**
 * SignatureWeb
 *
 * @author tangjiahui
 * @date 2024/5/14
 * @description pc executor
 */
import type { SignatureExecutor } from '../types';
import drawBezierLine from '../utils/drawBezierLine'

export class WebExecutor implements SignatureExecutor {
  private _points: Array<{ x: number; y: number }> = [];
  private _startPoint: { x: number; y: number } = null;
  private _isDrawFinish: boolean = false;
  private _unmount: () => void;

  public setCanvas(canvas: HTMLCanvasElement) {
    let handleStart;
    const that = this;
    const ctx: CanvasRenderingContext2D = setCtxStyle(canvas.getContext('2d'));
    canvas.addEventListener(
      'pointerdown',
      (handleStart = (e) => {
        const pos = that.getPos(e);
        that._points.push((that._startPoint = pos));
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerEnd);
      }),
    );

    function handlePointerMove(e) {
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

      if (e.cancelable) {
        e.preventDefault();
      }
    }

    function handlePointerEnd(e) {
      that._isDrawFinish = true;
      that._points.push(that.getPos(e));

      if (that._points.length > 3) {
        const [controlPoint, endPoint] = that._points.slice(-2);
        drawBezierLine(that._startPoint, controlPoint, endPoint, ctx);
      }

      that._startPoint = null;
      that._points = [];
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerEnd);
    }

    this._unmount = () => {
      canvas.removeEventListener('pointerdown', handleStart);
    };
  }

  public destroy() {
    this._unmount?.();
  }

  private getPos(e) {
    return {
      x: e?.layerX,
      y: e?.layerY,
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
