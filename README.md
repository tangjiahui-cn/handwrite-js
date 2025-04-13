## handwrite-js

手写签名 js-sdk ，同时支持`web`和`h5`，以及各类前端框架或原生html中使用。

## 在线预览
[https://tangjiahui-cn.github.io/handwrite-js](https://tangjiahui-cn.github.io/handwrite-js)

## 特点
- ✅ 支持任意前端框架（React、Vue等）。
- ✅ 支持web端、h5端。
- ✅ 支持修改画笔（颜色、粗细）。
- ✅ 支持修改画布背景。
- ✅ 支持导入、导出、下载。
- ✅ 大小仅5kb。

## 基本使用
In Html.

```html
<script src="https://unpkg.com/handwrite-js/umd/index.js"></script>
<div style="display: inline-block; border: 1px solid #ccc">
    <div id="dom" style="width: 300px; height: 500px"></div>
</div>
<script>
    const { HandWrite } = window.handWriteSdk;
    const handWrite = new HandWrite({
        dom: document.getElementById("dom"),
    });
    // handWrite.unmount(); // 卸载
</script>
```

In React.

```tsx
import { HandWrite } from 'handWrite-js'
import { useRef } from "react";

function Page() {
  const handWriteRef = useRef<HandWrite>();
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    handWriteRef.current = new HandWrite({
      dom: domRef.current
    });
    return () => {
      handWriteRef.current?.unmount?.();
      handWriteRef.current = undefined;
    }
  }, []);

  return (
    <div style="display: inline-block; border: 1px solid #ccc">
      <div ref="domRef" style="width: 300px; height: 500px"/>
    </div>
  )
}

```

In Vue.

```vue
<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import { HandWrite } from "handWrite-js";

  const domRef = ref();
  let handWrite = new HandWrite();

  onMounted(() => {
    handWrite.mount?.(domRef.value);
  });

  onUnmounted(() => {
    handWrite?.unmount?.();
    handWrite = undefined;
  });
</script>

<template>
  <div style="display: inline-block; border: 1px solid #ccc">
    <div ref="domRef" style="width: 300px; height: 500px" />
  </div>
</template>

```

## 本地调试
```shell
# node16、pnpm@7.30.5
pnpm i

pnpm dev
```

## API
### 基础 api：

|名称|描述|
|---|---|
|mount(dom)|挂载到dom节点（重复挂载会报错）|
|unmount()|卸载当前实例|
|clear()|清空画布（重置到上一次设置的背景色）|

### 高级 api:
|名称 | 描述|
|---|---|
|download(filename)|下载签名图片/其他格式|
|getBase64()|获取签名base64|
|setBase64(base64)|设置签名base64到画布|
|setImageUrl(url)|设置url对应图片到画布|
|setBackground(color)|设置背景颜色|
|setPen({size?, color?})|设置画笔|
