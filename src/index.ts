/**
 * beautiful - signature
 *
 * @author tangjiahui
 * @date 2024/5/14
 */

import { SignatureExecutor } from './types';
import { WebExecutor } from './executor/webExecutor';
import { MobileExecutor } from './executor/mobileExecutor';

enum DEVICE_TYPE {
  PC = 0,
  MOBILE = 1,
}

interface BeautifulSignatureConfig {
  width: number;
  height: number;
}

export class BeautifulSignature {
  _deviceType: DEVICE_TYPE;
  _config: BeautifulSignatureConfig;
  _executor: SignatureExecutor;

  constructor(config: BeautifulSignatureConfig) {
    this._config = {
      width: config.width,
      height: config.height,
    };
    this._deviceType = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
      ? DEVICE_TYPE.MOBILE
      : DEVICE_TYPE.PC;
    this._executor = this._deviceType === DEVICE_TYPE.PC ? new WebExecutor() : new MobileExecutor();
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
