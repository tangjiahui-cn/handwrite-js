/**
 * executor
 *
 * @author tangjiahui
 * @date 2024/5/14
 * @description collect the move points.
 */
import type { SignatureExecutor } from '../types';
import BezierRender from '../render';
import { isMobile } from '../utils/isMobile';

export class Executor implements SignatureExecutor {
  private _unmount: (() => void) | undefined;
  private _canvasRect: DOMRect | undefined;
  private _render: BezierRender = new BezierRender();

  public setCanvas(canvas: HTMLCanvasElement) {
    const that = this;
    const _isMobile = isMobile();
    const startEvent = _isMobile ? 'touchstart' : 'pointerdown';

    let isStart = false;
    let handleStart: (e: any) => void;
    this._render.setCanvas(canvas);
    this._canvasRect = canvas.getBoundingClientRect();
    canvas.addEventListener(
      startEvent,
      (handleStart = (e) => {
        const pos = that.getPos(e);
        that._render.reset();
        that._render.addPoint(pos);
        isStart = true;
        window.addEventListener('pointerup', handleEnd);
        _isMobile
          ? canvas.addEventListener('touchmove', handleMove)
          : window.addEventListener('pointermove', handleMove);
      }),
    );

    function handleMove(e: any) {
      that._render.addPoint(that.getPos(e));

      if (e.cancelable) {
        e.preventDefault();
      }
    }

    function handleEnd() {
      window.removeEventListener('pointerup', handleEnd);
      _isMobile
        ? canvas.removeEventListener('touchmove', handleMove)
        : window.removeEventListener('pointermove', handleMove);

      that._render.reset();
      isStart = false;
    }

    this._unmount = () => {
      canvas.removeEventListener(startEvent, handleStart);
      if (isStart) {
        handleEnd();
      }
    };
  }

  public destroy() {
    this._unmount?.();
  }

  private getPos(e: any) {
    e = e.touches?.[0] || e;
    return {
      x: (e?.x || e?.clientX) - (this._canvasRect?.x || 0),
      y: (e?.y || e?.clientY) - (this._canvasRect?.y || 0),
    };
  }
}
