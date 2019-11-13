/** @format */

import path from 'path';
import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';
import ts from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

import { name, version, author } from './package.json';

const lineName = name.split('/')[1];

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  cacheRoot: path.resolve(__dirname, 'node_modules/.cache'),
});
const banner = `/*!
  * ${lineName}.js v${version}
  * (c) 2014 - ${new Date().getFullYear()} ${author}
  * Released under the MIT License.
*/`;

const formats = ['umd'];

const output = () => {
  const outputList = [];

  formats.reduce((acc, format) => {
    const file = isMin => `dist/${lineName}${isMin ? '.min' : ''}.js`;
    const moduleName = lineName.charAt(0).toUpperCase() + lineName.slice(1);

    const base = {
      exports: 'named',
      format,
      name: moduleName,
      banner,
    };

    acc.push({
      ...base,
      file: file(),
    });

    if (process.env.NODE_ENV === 'production') {
      acc.push({
        ...base,
        file: file(true),
      });
    }
  }, outputList);

  return outputList;
};

const renderConfig = () => {
  const plugins = [
    eslint({
      fix: true,
    }),
    json(),
    alias({
      resolve: ['.ts', '.js'],
      entries: [
        { find: '@', replacement: './' }, // src 目录
      ],
    }),
    tsPlugin,
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      terser({
        include: [/^.+\.min\.js$/, 'umd'],
      }),
    );
  }

  return {
    cache: true,
    input: 'src/index.ts',
    output: output(),
    plugins,
    watch: {
      clearScreen: true,
    },
  };
};

export default renderConfig;
