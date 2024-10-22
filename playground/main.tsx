import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { HandWrite, INIT_PEN_ATTRIBUTES } from '../src';
import { Button, ColorPicker, message, Slider, Space } from 'antd';

function useUpdateEffect(cb: () => any, dependencies: any[]) {
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    cb();
  }, dependencies);
}

function Page() {
  const handWriteRef = useRef<HandWrite>();
  const domRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState<{
    penSize: number;
    penColor: string;
  }>({
    penSize: INIT_PEN_ATTRIBUTES.size,
    penColor: INIT_PEN_ATTRIBUTES.color,
  });

  const [bgColor, setBgColor] = useState('white');

  function handleClear() {
    handWriteRef.current?.clear?.();
  }

  function handleDownload() {
    handWriteRef?.current?.download?.();
  }

  function handleLogBase64() {
    const base64 = handWriteRef?.current?.getBase64?.();
    console.log('base64: ', base64);
  }

  function handleSetLocalBase64() {
    const base64 = localStorage.getItem('base64');
    if (!base64) {
      message.warning('请先暂存base64');
      return;
    }
    handWriteRef?.current?.setBase64?.(base64);
    message.success('设置成功');
  }

  function handleSaveLocalBase64() {
    localStorage.setItem('base64', handWriteRef?.current?.getBase64?.() || '');
    message.success('保存成功');
  }

  useUpdateEffect(() => {
    handWriteRef.current?.setPen?.({
      size: options?.penSize,
      color: options?.penColor,
    });
  }, [options]);

  useUpdateEffect(() => {
    handWriteRef.current?.setBackground?.(bgColor);
  }, [bgColor]);

  useEffect(() => {
    handWriteRef.current = new HandWrite({
      dom: domRef.current!,
    });

    return () => {
      handWriteRef.current?.unmount?.();
      handWriteRef.current = undefined;
    };
  }, []);

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ border: '1px solid #ccc' }}>
        <div ref={domRef} style={{ width: 300, height: 500 }} />
      </div>
      <Space direction={'vertical'} size={8}>
        <Space>
          <Button onClick={handleClear}>清空</Button>
          <Button onClick={handleDownload}>下载签名</Button>
          <Button onClick={handleLogBase64}>getBase64</Button>
        </Space>
        <Space>
          <Button onClick={handleSaveLocalBase64}>暂存base64</Button>
          <Button onClick={handleSetLocalBase64}>设置base64</Button>
        </Space>
        <Space>
          画笔大小:
          <Slider
            style={{ width: 200 }}
            min={1}
            max={100}
            onChange={(penSize) => {
              setOptions({
                ...options,
                penSize,
              });
            }}
          />
        </Space>
        <Space>
          画笔颜色:
          <ColorPicker
            value={options?.penColor}
            onChange={(color) => {
              setOptions({
                ...options,
                penColor: `#${color.toHex()}`,
              });
            }}
          />
        </Space>
        <Space>
          背景颜色:
          <ColorPicker
            value={bgColor}
            onChange={(color) => {
              setBgColor(`#${color.toHex()}`);
            }}
          />
        </Space>
      </Space>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Page />);
