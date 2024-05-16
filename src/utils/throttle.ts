export default function throttle(fn: (...args: any) => void, delay = 10): (...args: any) => void {
  let timerId = null;
  return function (...args) {
    if (timerId) {
      return;
    }
    fn.apply(this, arguments);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
}
