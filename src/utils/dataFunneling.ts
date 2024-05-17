/**
 * data funneling
 *
 * @author tangjiahui
 * @date 2024/5/16
 * @description collect data immediately and run data with uniform speed
 */
import throttle from './throttle';

type Callback<T> = (data: T) => void;

interface Config {
  /**
   * data funneling interval
   */
  interval?: number;
}

export default class DataFunneling<T = any> {
  private interval: number;
  private callbacks: Callback<T>[] = [];
  private throttleFn: Callback<T>;

  constructor(config?: Config) {
    const that = this;
    this.interval = config?.interval;
    this.throttleFn =
      this.interval > 0
        ? throttle((data: T) => {
            that.callbacks.forEach((callback: Callback<T>) => {
              callback(data);
            });
          }, this.interval)
        : (data: T) => {
            that.callbacks.forEach((callback: Callback<T>) => {
              callback(data);
            });
          };
  }

  public add(data: T) {
    this.throttleFn(data);
  }

  public on(callback: Callback<T>) {
    this.callbacks.push(callback);
  }
}
