var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { HandWrite, INIT_PEN_ATTRIBUTES } from '../src';
import { Button, ColorPicker, message, Slider, Space } from 'antd';
function useUpdateEffect(cb, dependencies) {
    var firstRef = useRef(true);
    useEffect(function () {
        if (firstRef.current) {
            firstRef.current = false;
            return;
        }
        cb();
    }, dependencies);
}
function Page() {
    var handWriteRef = useRef();
    var domRef = useRef(null);
    var _a = useState({
        penSize: INIT_PEN_ATTRIBUTES.size,
        penColor: INIT_PEN_ATTRIBUTES.color,
    }), options = _a[0], setOptions = _a[1];
    var _b = useState('white'), bgColor = _b[0], setBgColor = _b[1];
    function handleClear() {
        var _a, _b;
        (_b = (_a = handWriteRef.current) === null || _a === void 0 ? void 0 : _a.clear) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    function handleDownload() {
        var _a, _b;
        (_b = (_a = handWriteRef === null || handWriteRef === void 0 ? void 0 : handWriteRef.current) === null || _a === void 0 ? void 0 : _a.download) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    function handleLogBase64() {
        var _a, _b;
        var base64 = (_b = (_a = handWriteRef === null || handWriteRef === void 0 ? void 0 : handWriteRef.current) === null || _a === void 0 ? void 0 : _a.getBase64) === null || _b === void 0 ? void 0 : _b.call(_a);
        console.log('base64: ', base64);
    }
    function handleSetLocalBase64() {
        var _a, _b;
        var base64 = localStorage.getItem('base64');
        if (!base64) {
            message.warning('请先暂存base64');
            return;
        }
        (_b = (_a = handWriteRef === null || handWriteRef === void 0 ? void 0 : handWriteRef.current) === null || _a === void 0 ? void 0 : _a.setBase64) === null || _b === void 0 ? void 0 : _b.call(_a, base64);
        message.success('设置成功');
    }
    function handleSaveLocalBase64() {
        var _a, _b;
        localStorage.setItem('base64', ((_b = (_a = handWriteRef === null || handWriteRef === void 0 ? void 0 : handWriteRef.current) === null || _a === void 0 ? void 0 : _a.getBase64) === null || _b === void 0 ? void 0 : _b.call(_a)) || '');
        message.success('保存成功');
    }
    useUpdateEffect(function () {
        var _a, _b;
        (_b = (_a = handWriteRef.current) === null || _a === void 0 ? void 0 : _a.setPen) === null || _b === void 0 ? void 0 : _b.call(_a, {
            size: options === null || options === void 0 ? void 0 : options.penSize,
            color: options === null || options === void 0 ? void 0 : options.penColor,
        });
    }, [options]);
    useUpdateEffect(function () {
        var _a, _b;
        (_b = (_a = handWriteRef.current) === null || _a === void 0 ? void 0 : _a.setBackground) === null || _b === void 0 ? void 0 : _b.call(_a, bgColor);
    }, [bgColor]);
    useEffect(function () {
        handWriteRef.current = new HandWrite({
            dom: domRef.current,
        });
        return function () {
            var _a, _b;
            (_b = (_a = handWriteRef.current) === null || _a === void 0 ? void 0 : _a.unmount) === null || _b === void 0 ? void 0 : _b.call(_a);
            handWriteRef.current = undefined;
        };
    }, []);
    return (_jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsx("div", { style: { border: '1px solid #ccc' }, children: _jsx("div", { ref: domRef, style: { width: 300, height: 500 } }) }), _jsxs(Space, { direction: 'vertical', size: 8, children: [_jsxs(Space, { children: [_jsx(Button, { onClick: handleClear, children: "\u6E05\u7A7A" }), _jsx(Button, { onClick: handleDownload, children: "\u4E0B\u8F7D\u7B7E\u540D" }), _jsx(Button, { onClick: handleLogBase64, children: "getBase64" })] }), _jsxs(Space, { children: [_jsx(Button, { onClick: handleSaveLocalBase64, children: "\u6682\u5B58base64" }), _jsx(Button, { onClick: handleSetLocalBase64, children: "\u8BBE\u7F6Ebase64" })] }), _jsxs(Space, { children: ["\u753B\u7B14\u5927\u5C0F:", _jsx(Slider, { style: { width: 200 }, min: 1, max: 100, onChange: function (penSize) {
                                    setOptions(__assign(__assign({}, options), { penSize: penSize }));
                                } })] }), _jsxs(Space, { children: ["\u753B\u7B14\u989C\u8272:", _jsx(ColorPicker, { value: options === null || options === void 0 ? void 0 : options.penColor, onChange: function (color) {
                                    setOptions(__assign(__assign({}, options), { penColor: "#".concat(color.toHex()) }));
                                } })] }), _jsxs(Space, { children: ["\u80CC\u666F\u989C\u8272:", _jsx(ColorPicker, { value: bgColor, onChange: function (color) {
                                    setBgColor("#".concat(color.toHex()));
                                } })] })] })] }));
}
createRoot(document.getElementById('root')).render(_jsx(Page, {}));
