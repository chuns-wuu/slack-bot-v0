module.exports = {
    target: 'node',
    mode: 'development',
    entry: "./src/app.ts",
    output: {
      filename: "./dist/app.js",
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
    // Other options...
  };