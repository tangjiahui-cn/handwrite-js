export default function throttle(fn: (...args: any) => void, delay = 10): (...args: any) => void {
  let timerId: number | null = null;
  return function (...args) {
    if (timerId) {
      return;
    }
    fn.apply(this, args);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
}
