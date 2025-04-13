/**
 * HandleWrite-js
 *
 * @author tangjiahui
 * @date 2025/4/13
 * @description 支持前端手签。
 */

import { Renderer, PenAttributes } from './Renderer';
import { isMobile } from './utils/isMobile';

export type { PenAttributes } from './Renderer';
export { INIT_PEN_ATTRIBUTES } from './Renderer';

type Unmount = () => void;

/** 收集点坐标 */
export interface Point {
  x: number;
  y: number;
}

/** 配置项 */
export interface HandWriteOptions {
  width?: number;
  height?: number;
  dom?: HTMLElement;
}

const _isMobile: boolean = isMobile();
export class HandWrite {
  /** canvas元素 */
  private canvasEl: HTMLCanvasElement | null = null;
  /** 渲染器 */
  private renderer: Renderer = new Renderer();
  /** 配置项 */
  private options: HandWriteOptions;
  /** 卸载函数 */
  private unmountListener: Unmount | undefined;
  /** 是否挂载变量 */
  private _haveBeenMount: boolean = false;

  constructor(options: HandWriteOptions) {
    this.options = options;
    if (options?.dom) {
      this.mount(options?.dom);
    }
  }

  /** 挂载dom */
  public mount(dom: HTMLElement) {
    if (!dom) {
      throw new Error('mount dom must be exist.');
    }

    if (this._haveBeenMount) {
      throw new Error('handWrite have been mount already.');
    }

    const rectInfo: DOMRect = dom?.getBoundingClientRect();
    const width: number = (this.options?.width ?? rectInfo.width) || 0;
    const height: number = this.options?.height || rectInfo.height || 0;
    this.canvasEl = createCanvas(width, height);
    dom.appendChild(this.canvasEl);

    /** 给canvas添加点收集监听器 */
    this.unmountListener = this.appendListener(this.canvasEl);
    /** 初始化渲染器 */
    this.renderer.init(this.canvasEl);
    /** 挂载标识符设置 */
    this._haveBeenMount = true;
  }

  /** 卸载 */
  public unmount() {
    if (!this.canvasEl) return;
    this?.unmountListener?.();
    this.unmountListener = undefined;
    this.canvasEl?.remove?.();
    this.canvasEl = null;
    this._haveBeenMount = false;
  }

  /** 清空画板 */
  public clear() {
    this.renderer.clear();
  }

  /** 下载绘制内容 */
  public download(filename = '签名.png') {
    const base64: string = this.getBase64();
    let a: HTMLAnchorElement | null = document.createElement('a');
    a.href = base64;
    a.download = filename;
    a.style.display = 'none';
    a.click();
    a = null;
  }

  /** 获取当前画板的base64值 */
  public getBase64(mime = 'image/png'): string {
    return this.canvasEl?.toDataURL?.(mime) || '';
  }

  /** 使用base64内容填充画板 */
  public setBase64(base64: string): void {
    this.setImgUrl(base64);
  }

  /** 使用图片填充画板 */
  public setImgUrl(url: string): void {
    if (!this.canvasEl) {
      throw new Error('canvasEl is null.');
    }
    this.renderer.setBase64(url);
  }

  public setBackground(background: string): void {
    this.renderer.setBackground(background);
  }

  public setPen(attributes: Partial<PenAttributes>) {
    this.renderer.setPen(attributes);
  }

  /** 注册收集点的事件 */
  private appendListener(canvas: HTMLCanvasElement): Unmount {
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

/** 获取坐标点 */
function getPoint(e: any, originPoint: Point) {
  e = _isMobile ? e?.touches?.[0] : e;
  return {
    x: e?.clientX - originPoint.x,
    y: e?.clientY - originPoint.y,
  };
}
