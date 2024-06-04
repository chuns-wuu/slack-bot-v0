const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    const isDev = env === 'development';
    const isProd = !isDev
    const config = {
        target: 'node',
        entry: {
            app: "./src/app.ts", 
            api: "./src/api.ts"
        },
        output: {
            path: path.resolve(__dirname, 'dist'), // Output directory
            filename: '[name].js', // Output filename
            libraryTarget: 'commonjs2'
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",
        resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        },
        module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ],
        },
        optimization: {
            minimize: !isProd,
            minimizer:!isProd ? [
                // Use TerserPlugin only in production
                new TerserPlugin({
                    // Terser options
                })
            ] : []
        },
        devtool: isProd ? 'inline-source-map' : false
    }
    return config;
};