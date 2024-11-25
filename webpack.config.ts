import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import Dotenv from 'dotenv-webpack';

const outputPath = 'dist';

const entryPoints = {
	app: [path.resolve(__dirname, 'src/shared', 'app.ts')],
	service_worker: path.resolve(__dirname, 'src/shared', 'service_worker.ts'),
	content_script: path.resolve(__dirname, 'src/shared', 'content_script.ts'),
	sidepanel: path.resolve(__dirname, 'src/sidepanel', 'sidepanel.ts'),
};

module.exports = {
	entry: entryPoints,
	output: {
		path: path.join(__dirname, outputPath),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
				use: 'url-loader?limit=1024',
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '.', context: 'dist' }],
		}),
		new Dotenv(),
	],
};
