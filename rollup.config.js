/**
 * Rollup Config.
 *
 * @author tangjiahui
 * @date 2024/5/15
 */
import { rimrafSync } from 'rimraf';
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
var VAR_NAME = 'handWriteSdk'; // window[VAR_NAME]
var list = [
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
];
rimrafSync(list.map(function (x) { return (x === null || x === void 0 ? void 0 : x.dir) || ''; }));
export default defineConfig({
    input: './src/index.ts',
    output: list,
    plugins: [typescript(), json(), terser()],
});
