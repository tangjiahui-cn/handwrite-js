/**
 * beautiful - signature
 *
 * @author tangjiahui
 * @date 2024/5/14
 */

import { Executor } from './executor';

interface BeautifulSignatureConfig {
  width: number;
  height: number;
  executor?: Executor;
}

export default class BeautifulSignature {
  _config: BeautifulSignatureConfig;
  _executor: Executor;

  constructor(config: BeautifulSignatureConfig) {
    this._executor = new Executor();
    this._config = {
      width: config.width,
      height: config.height,
    };
  }

  public mount(dom: HTMLElement) {
    const canvas = document.createElement('canvas');
    canvas.style.setProperty('width', `${this._config.width}px`);
    canvas.style.setProperty('height', `${this._config.height}px`);
    canvas.style.setProperty('border', `1px solid black`);
    canvas.width = this._config.width;
    canvas.height = this._config.height;
    dom.appendChild(canvas);
    this._executor.setCanvas(canvas);
  }

  // operate
  public clear() {}
  public revoke() {}

  // get
  public getFile() {}
  public getBase64() {}
  public getCanvas() {}
  public getImage() {}

  // set
  public setFile() {}
  public setBase64() {}
  public setImageUrl() {}

  // download
  public download() {}
}
