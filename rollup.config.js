import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import discardComments from 'postcss-discard-comments';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));

export default {
	entry: 'src/index.js',
	dest: pkg.main,
	sourceMap: path.resolve(pkg.main),
	moduleName: pkg.amdName,
	format: 'umd',
	external,
	plugins: [
		babel({
			babelrc: false,
			comments: false,
			exclude: 'node_modules/**',
			presets: [
				'es2015-loose-rollup',
				'stage-0'
			],
			plugins: [
				'transform-class-properties',
				['transform-react-jsx', { pragma: 'h' }]
			]
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			skip: external
		}),
		commonjs({
			include: 'node_modules/**',
			exclude: '**/*.css'
		}),
		postcss({
			plugins: [
				discardComments({ removeAll: true })
			]
		})
	]
};
