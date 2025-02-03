/**
 * data funneling
 *
 * @author tangjiahui
 * @date 2024/5/16
 * @description collect data immediately and run data with uniform speed
 */
import throttle from './throttle';
var DataFunneling = /** @class */ (function () {
    function DataFunneling(config) {
        this.callbacks = [];
        var that = this;
        this.interval = (config === null || config === void 0 ? void 0 : config.interval) || 0;
        this.throttleFn =
            this.interval > 0
                ? throttle(function (data) {
                    that.callbacks.forEach(function (callback) {
                        callback(data);
                    });
                }, this.interval)
                : function (data) {
                    that.callbacks.forEach(function (callback) {
                        callback(data);
                    });
                };
    }
    DataFunneling.prototype.add = function (data) {
        this.throttleFn(data);
    };
    DataFunneling.prototype.on = function (callback) {
        this.callbacks.push(callback);
    };
    return DataFunneling;
}());
export default DataFunneling;
