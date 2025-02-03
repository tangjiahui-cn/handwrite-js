/**
 * HandleWrite-js
 */
import { Renderer } from './Renderer';
import { isMobile } from './utils/isMobile';
export { INIT_PEN_ATTRIBUTES } from './Renderer';
var _isMobile = isMobile();
var HandWrite = /** @class */ (function () {
    function HandWrite(options) {
        this.canvasEl = null; // canvas element.
        this.renderer = new Renderer(); // renderer
        this._haveBeenMount = false; // if have been mount the canvas;
        this.options = options;
        if (options === null || options === void 0 ? void 0 : options.dom) {
            this.mount(options === null || options === void 0 ? void 0 : options.dom);
        }
    }
    HandWrite.prototype.mount = function (dom) {
        var _a, _b, _c;
        if (!dom) {
            throw new Error('mount dom is null.');
        }
        if (this._haveBeenMount) {
            throw new Error('handWrite have been mount already.');
        }
        var rectInfo = dom === null || dom === void 0 ? void 0 : dom.getBoundingClientRect();
        var width = ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : rectInfo.width) || 0;
        var height = ((_c = this.options) === null || _c === void 0 ? void 0 : _c.height) || rectInfo.height || 0;
        this.canvasEl = createCanvas(width, height);
        dom.appendChild(this.canvasEl);
        // append listener to canvas
        this.unmountListener = this.appendListener(this.canvasEl);
        // the renderer bind to canvas
        this.renderer.init(this.canvasEl);
        this._haveBeenMount = true;
    };
    HandWrite.prototype.unmount = function () {
        var _a, _b, _c;
        if (!this.canvasEl)
            return;
        (_a = this === null || this === void 0 ? void 0 : this.unmountListener) === null || _a === void 0 ? void 0 : _a.call(this);
        this.unmountListener = undefined;
        (_c = (_b = this.canvasEl) === null || _b === void 0 ? void 0 : _b.remove) === null || _c === void 0 ? void 0 : _c.call(_b);
        this.canvasEl = null;
        this._haveBeenMount = false;
    };
    HandWrite.prototype.clear = function () {
        this.renderer.clear();
    };
    HandWrite.prototype.download = function (filename) {
        if (filename === void 0) { filename = '签名.png'; }
        var base64 = this.getBase64();
        var a = document.createElement('a');
        a.href = base64;
        a.download = filename;
        a.style.display = 'none';
        a.click();
        a = null;
    };
    HandWrite.prototype.getBase64 = function (mime) {
        var _a, _b;
        if (mime === void 0) { mime = 'image/png'; }
        return ((_b = (_a = this.canvasEl) === null || _a === void 0 ? void 0 : _a.toDataURL) === null || _b === void 0 ? void 0 : _b.call(_a, mime)) || '';
    };
    HandWrite.prototype.setBase64 = function (base64) {
        this.setImgUrl(base64);
    };
    HandWrite.prototype.setImgUrl = function (url) {
        if (!this.canvasEl) {
            throw new Error('canvasEl is null.');
        }
        this.renderer.setBase64(url);
    };
    HandWrite.prototype.setBackground = function (background) {
        this.renderer.setBackground(background);
    };
    HandWrite.prototype.setPen = function (attributes) {
        this.renderer.setPen(attributes);
    };
    HandWrite.prototype.appendListener = function (canvas) {
        var _this = this;
        var originPoint = canvas.getBoundingClientRect();
        var startEventName = _isMobile ? 'touchstart' : 'pointerdown';
        var moveName = _isMobile ? 'touchmove' : 'pointermove';
        var start = function (e) {
            var _a;
            _this.renderer.clearPoint();
            _this.renderer.addPoint(getPoint(e, originPoint));
            window.addEventListener('pointerup', end);
            (_a = (_isMobile ? canvas : window)) === null || _a === void 0 ? void 0 : _a.addEventListener(moveName, move);
        };
        var move = function (e) {
            _this.renderer.addPoint(getPoint(e, originPoint));
            if (e.cancelable) {
                e.preventDefault();
            }
        };
        var end = function (e) {
            _this.renderer.addPoint(getPoint(e, originPoint));
            removeAllListener();
        };
        var removeAllListener = function () {
            var _a;
            window.removeEventListener('pointerup', end);
            (_a = (_isMobile ? canvas : window)) === null || _a === void 0 ? void 0 : _a.removeEventListener(moveName, move);
        };
        canvas.addEventListener(startEventName, start);
        return function () {
            canvas.removeEventListener(startEventName, start);
            removeAllListener();
        };
    };
    return HandWrite;
}());
export { HandWrite };
// 创建一个空的canvas
function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "".concat(width, "px");
    canvas.style.height = "".concat(height, "px");
    return canvas;
}
function getPoint(e, originPoint) {
    var _a;
    e = ((_a = e.touches) === null || _a === void 0 ? void 0 : _a[0]) || e;
    return {
        x: ((e === null || e === void 0 ? void 0 : e.x) || (e === null || e === void 0 ? void 0 : e.clientX)) - originPoint.x,
        y: ((e === null || e === void 0 ? void 0 : e.y) || (e === null || e === void 0 ? void 0 : e.clientY)) - originPoint.y,
    };
}
