import drawBezierLine from './utils/drawBezierLine';
import { getImgFromUrl } from './utils/getImgFromUrl';
export var INIT_PEN_ATTRIBUTES = {
    color: '#000',
    size: 4,
};
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.lastPoint = null;
        this.pointList = [];
        this.canvasEl = null;
        this.ctx = null;
    }
    Renderer.prototype.init = function (canvas) {
        this.canvasEl = canvas;
        this.ctx = canvas.getContext('2d');
        // set draw style.
        this.setStyle();
    };
    Renderer.prototype.addPoint = function (point) {
        this.pointList.push(point);
        this.flush();
    };
    Renderer.prototype.clearPoint = function () {
        this.pointList = [];
        this.lastPoint = null;
    };
    Renderer.prototype.clear = function () {
        this.clearPoint();
        this.setBackground();
    };
    Renderer.prototype.setBase64 = function (base64) {
        var _this = this;
        getImgFromUrl(base64).then(function (img) {
            var _a;
            (_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(img, 0, 0);
        });
    };
    Renderer.prototype.setBackground = function (bgColor) {
        if (!this.canvasEl)
            return;
        if (bgColor) {
            this.ctx.fillStyle = bgColor;
        }
        this.ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    };
    Renderer.prototype.setPen = function (attributes) {
        if (attributes === null || attributes === void 0 ? void 0 : attributes.size) {
            this.ctx.lineWidth = attributes.size;
        }
        if (attributes === null || attributes === void 0 ? void 0 : attributes.color) {
            this.ctx.strokeStyle = attributes.color;
        }
    };
    // render to canvas.
    Renderer.prototype.flush = function () {
        if (!this.ctx) {
            throw new Error('Please use the "use" method to set the canvas at first.');
        }
        if (!this.pointList.length) {
            return;
        }
        var _a = this.pointList.slice(-2), p1 = _a[0], p2 = _a[1];
        var controlPoint = p1;
        var endPoint = p2
            ? {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            }
            : p1;
        drawBezierLine(this.lastPoint || p1, controlPoint, endPoint, this.ctx);
        this.lastPoint = endPoint;
    };
    Renderer.prototype.setStyle = function () {
        if (!this.canvasEl) {
            return;
        }
        // this.canvasEl.style.border = '1px solid black';
        this.ctx = this.canvasEl.getContext('2d');
        this.ctx.lineJoin = 'round'; // 转折处圆形
        this.ctx.lineCap = 'round'; // 末端圆形
        this.setBackground('white');
        this.setPen(INIT_PEN_ATTRIBUTES);
    };
    return Renderer;
}());
export { Renderer };
