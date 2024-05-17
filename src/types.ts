export abstract class SignatureExecutor {
  public abstract setCanvas: (canvas: HTMLCanvasElement) => void;
  public abstract destroy: () => void;
}

export interface Point {
  x: number;
  y: number;
}
