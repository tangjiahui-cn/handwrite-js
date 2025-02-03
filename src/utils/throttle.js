export default function throttle(fn, delay) {
    if (delay === void 0) { delay = 10; }
    var timerId = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timerId) {
            return;
        }
        fn.apply(this, args);
        timerId = setTimeout(function () {
            timerId = null;
        }, delay);
    };
}
