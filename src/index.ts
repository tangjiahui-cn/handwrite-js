/**
 * 手写 SDK
 *
 * 特性：
 * （1）✅ 同时支持 WEB、H5
 * （2）✅ 支持原生 HTML、常见前端框架
 * （3）提供基础 API
 * （4）✅ 控制画笔属性（颜色、粗细）
 * （5）✅ 修改画布属性（背景）
 */

import { Renderer } from './Renderer';
import { isMobile } from './utils/isMobile';

// 点坐标（相对于画布左上角）
export interface Point {
  x: number;
  y: number;
}

export interface HandWriteOptions {
  width: number;
  height: number;
}

export class HandWrite {
  private canvasEl: HTMLCanvasElement | null = null; // 画布 DOM 元素
  private renderer: Renderer = new Renderer(); // 渲染器
  private options: HandWriteOptions; // 配置项
  private unmountListener: (() => void) | undefined; // 卸载

  constructor(options: HandWriteOptions) {
    if (!options?.width) {
      throw new Error('options.width is required.');
    }
    if (!options?.height) {
      throw new Error('options.width is required.');
    }
    this.options = options;
  }

  public mount(el: HTMLElement) {
    if (!el) {
      throw new Error('mount dom is null.');
    }

    // if have been mounted, clear the last dom info.
    if (this.canvasEl) {
      this.unmount();
    }

    // create a canvas element, and append to el.
    this.canvasEl = createCanvas(this.options.width, this.options.height);
    el.appendChild(this.canvasEl);
    // append listener to canvas
    this.unmountListener = this.appendListener(this.canvasEl);
    // the renderer bind to canvas
    this.renderer.use(this.canvasEl);
  }

  public unmount() {
    if (!this.canvasEl) return;
    this?.unmountListener?.();
    this.unmountListener = undefined;
    this.canvasEl?.remove?.();
    this.canvasEl = null;
  }

  // 添加监听器
  private appendListener(canvas: HTMLCanvasElement): () => void {
    const _isMobile: boolean = isMobile();
    const originPoint: Point = canvas.getBoundingClientRect();

    const getPoint = (e: any, originPoint: Point) => {
      e = e.touches?.[0] || e;
      return {
        x: (e?.x || e?.clientX) - originPoint.x,
        y: (e?.y || e?.clientY) - originPoint.y,
      };
    };

    const startEventName = _isMobile ? 'touchstart' : 'pointerdown';
    const moveName = _isMobile ? 'touchmove' : 'pointermove';

    const start = (e: MouseEvent | TouchEvent) => {
      this.renderer.clear();
      this.renderer.add(getPoint(e, originPoint));

      window.addEventListener('pointerup', end);
      (_isMobile ? canvas : window)?.addEventListener(moveName, move as any);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      this.renderer.add(getPoint(e, originPoint));
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const end = (e: MouseEvent | TouchEvent) => {
      this.renderer.add(getPoint(e, originPoint));
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

  public createPen() {
    return {
      size: 10,
      color: 'red',
      background: 'black',
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
