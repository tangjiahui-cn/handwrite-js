/**
 * executor
 *
 * @author tangjiahui
 * @date 2024/5/14
 * @description move pointer executor
 */
import type { SignatureExecutor } from '../types';
import BezierRender from '../render';
import { isMobile } from '../utils/isMobile';

export class Executor implements SignatureExecutor {
  private _unmount: () => void;
  private _canvasRect: DOMRect;
  private _render: BezierRender = new BezierRender();

  public setCanvas(canvas: HTMLCanvasElement) {
    const that = this;
    const startEvent = isMobile() ? 'touchstart' : 'pointerdown';
    const moveEvent = isMobile() ? 'touchmove' : 'pointermove';

    let isStart = false;
    let handleStart;
    this._render.setCanvas(canvas);
    this._canvasRect = canvas.getBoundingClientRect();
    canvas.addEventListener(
      startEvent,
      (handleStart = (e) => {
        const pos = that.getPos(e);
        that._render.reset();
        that._render.addPoint(pos);
        isStart = true;
        canvas.addEventListener(moveEvent, handleMove);
        window.addEventListener('pointerup', handleEnd);
      }),
    );

    function handleMove(e) {
      that._render.addPoint(that.getPos(e));

      if (e.cancelable) {
        e.preventDefault();
      }
    }

    function handleEnd() {
      canvas.removeEventListener(moveEvent, handleMove);
      window.removeEventListener('pointerup', handleEnd);
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

  private getPos(e) {
    e = e.touches?.[0] || e;
    return {
      x: e?.clientX - (this._canvasRect?.x || 0),
      y: e?.clientY - (this._canvasRect?.y || 0),
    };
  }
}
