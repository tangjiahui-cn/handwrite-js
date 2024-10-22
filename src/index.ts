/**
 * HandleWrite-js
 */

import { Renderer, PenAttributes } from './Renderer';
import { isMobile } from './utils/isMobile';

export type { PenAttributes } from './Renderer';
export { INIT_PEN_ATTRIBUTES } from './Renderer';

// 点坐标（相对于画布左上角）
export interface Point {
  x: number;
  y: number;
}

export interface HandWriteOptions {
  width?: number;
  height?: number;
  dom?: HTMLElement;
}

const _isMobile: boolean = isMobile();
export class HandWrite {
  private canvasEl: HTMLCanvasElement | null = null; // canvas element.
  private renderer: Renderer = new Renderer(); // renderer
  private options: HandWriteOptions; // handWrite config
  private unmountListener: (() => void) | undefined; // unmount listener callback
  private _haveBeenMount: boolean = false; // if have been mount the canvas;

  constructor(options: HandWriteOptions) {
    this.options = options;
    if (options?.dom) {
      this.mount(options?.dom);
    }
  }

  public mount(dom: HTMLElement) {
    if (!dom) {
      throw new Error('mount dom is null.');
    }

    if (this._haveBeenMount) {
      throw new Error('handWrite have been mount already.');
    }

    const rectInfo: DOMRect = dom?.getBoundingClientRect();
    const width: number = (this.options?.width ?? rectInfo.width) || 0;
    const height: number = this.options?.height || rectInfo.height || 0;
    this.canvasEl = createCanvas(width, height);
    dom.appendChild(this.canvasEl);
    // append listener to canvas
    this.unmountListener = this.appendListener(this.canvasEl);
    // the renderer bind to canvas
    this.renderer.init(this.canvasEl);
    this._haveBeenMount = true;
  }

  public unmount() {
    if (!this.canvasEl) return;
    this?.unmountListener?.();
    this.unmountListener = undefined;
    this.canvasEl?.remove?.();
    this.canvasEl = null;
    this._haveBeenMount = false;
  }

  public clear() {
    this.renderer.clear();
  }

  public download(filename = '签名.png') {
    const base64: string = this.getBase64();
    let a: HTMLAnchorElement | null = document.createElement('a');
    a.href = base64;
    a.download = filename;
    a.style.display = 'none';
    a.click();
    a = null;
  }

  public getBase64(mime = 'image/png'): string {
    return this.canvasEl?.toDataURL?.(mime) || '';
  }

  public setBase64(base64: string): void {
    this.setImgUrl(base64);
  }

  public setImgUrl(url: string): void {
    if (!this.canvasEl) {
      throw new Error('canvasEl is null.');
    }
    this.renderer.setBase64(url);
  }

  public setBackground(background: string): void {
    this.renderer.setBackground(background);
  }

  public setPen(attributes: PenAttributes) {
    this.renderer.setPen(attributes);
  }

  private appendListener(canvas: HTMLCanvasElement): () => void {
    const originPoint: Point = canvas.getBoundingClientRect();

    const startEventName = _isMobile ? 'touchstart' : 'pointerdown';
    const moveName = _isMobile ? 'touchmove' : 'pointermove';

    const start = (e: MouseEvent | TouchEvent) => {
      this.renderer.clearPoint();
      this.renderer.addPoint(getPoint(e, originPoint));

      window.addEventListener('pointerup', end);
      (_isMobile ? canvas : window)?.addEventListener(moveName, move as any);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      this.renderer.addPoint(getPoint(e, originPoint));
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const end = (e: MouseEvent | TouchEvent) => {
      this.renderer.addPoint(getPoint(e, originPoint));
      removeAllListener();
    };

    const removeAllListener = () => {
      window.removeEventListener('pointerup', end);
      (_isMobile ? canvas : window)?.removeEventListener(moveName, move as any);
    };

    canvas.addEventListener(startEventName, start);
    return () => {
      canvas.removeEventListener(startEventName, start);
      removeAllListener();
    };
  }
}

// 创建一个空的canvas
function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return canvas;
}

function getPoint(e: any, originPoint: Point) {
  e = e.touches?.[0] || e;
  return {
    x: (e?.x || e?.clientX) - originPoint.x,
    y: (e?.y || e?.clientY) - originPoint.y,
  };
}
