## handwrite-js

一个js手写库，支持Web端、H5端，并提供基础API控制。

## 功能
- ✅ 同时支持web端、h5端。
- ✅ 支持流行前端框架，例如：react、vue等。
- ✅ 支持修改画笔颜色、粗细。
- ✅ 支持修改画布背景。
- ✅ 支持导入、导出签名。

## 基本使用
In Html.

```html
<div id="dom" style="width: 300px;height: 500px;"></div>
<script>
    const handWrite = new HandWrite({
        dom: document.getElementById('dom')
    });
    // handWrite.unmount(); // 卸载
</script>
```

In React.

```tsx
import {HandWrite} from 'HandWrite'
import {useRef} from "react";

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
    <div style={{width: 300, height: 500}} ref={domRef}>
    </div>
  )
}

```

In Vue.

```vue

<script setup>
  import {ref, onMounted, onUnmounted} from "vue";
  import {HandWrite} from "HandWrite";

  const domRef = ref();
  let handWrite = new HandWrite();

  onMounted(() => {
    handWrite.mount?.(domRef.value)
  })
  
  onUnmounted(() => {
    handWrite?.unmount?.()
    handWrite = undefined
  })
</script>

<template>
  <div ref="domRef" style="width: 300px;height: 500px;" />
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

| 名称          | 描述                 |
|-------------|--------------------|
| mount (dom) | 挂载到dom节点（重复挂载会报错）  |
| unmount ()  | 卸载当前实例             |
| clear () | 清空画布（重置到上一次设置的背景色） |

### 扩展 api：

| 名称                       | 描述     |
|--------------------------|--------|
| download (filename)      | 下载签名到本地 |
| getBase64 ()             | 获取当前签名的base64 |
| setBase64 (base64)       | 设置base64到签名 |
| setImgUrl (url)          | 设置url的图片为签名 |
| setBackground (color)    | 修改画布背景 |
| setPen ({ size, color }) | 设置画笔属性（大小、颜色） |
