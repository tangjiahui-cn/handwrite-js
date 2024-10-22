/**
 * Rollup Config.
 *
 * @author tangjiahui
 * @date 2024/5/15
 */
import { rimraf, rimrafSync } from 'rimraf';
import {defineConfig, OutputOptions} from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const VAR_NAME = 'HandWrite';
const list = [
  {
    dir: 'es',
    format: 'es',
  },
  {
    dir: 'umd',
    format: 'umd',
    name: VAR_NAME,
  },
  {
    dir: 'lib',
    format: 'cjs',
  },
] as OutputOptions[];

rimrafSync(list.map((x) => x?.dir || ''));
export default defineConfig({
  input: './src/index.ts',
  output: list,
  plugins: [typescript(), json(), terser()],
});
