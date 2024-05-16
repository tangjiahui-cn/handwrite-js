/**
 * Rollup Config.
 *
 * @author tangjiahui
 * @date 2024/5/15
 */
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/**
 * transform to hump style
 *
 * @param lineStyle line-style string.
 * @param isFirstUpperCase is first character uppercase.
 * @return {string} hump-style string.
 * @example
 *  - toHumpStyle("my-package") => "myPackage"
 *  - toHumpStyle("my-package", true) => "MyPackage"
 */
function toHumpStyle(lineStyle, isFirstUpperCase) {
  let str = '';
  let lastIndex = -2;
  for (let i = 0; i < lineStyle.length; i++) {
    const v = lineStyle[i];
    if (v === '-') {
      lastIndex = i;
    } else {
      const isFirst = i === 0 && isFirstUpperCase;
      str += isFirst || lastIndex === i - 1 ? v.toUpperCase() : v;
    }
  }
  return str;
}

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      dir: 'lib',
      format: 'umd',
      name: toHumpStyle(pkg.name, true),
    },
    {
      dir: 'es',
      format: 'es',
    },
  ],
  plugins: [typescript(), json(), terser()],
});
