import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
const config = {
  input: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup', 'stage-0'],
      plugins: ['transform-class-properties'],
    }),
    commonjs(),
  ],
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'Validate',
  },
};
export default config;
