export abstract class SignatureExecutor {
  public setCanvas: (canvas: HTMLCanvasElement) => void;
  public destroy: () => void;
}

export interface Point {
  x: number;
  y: number;
}
