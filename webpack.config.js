const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const BomPlugin = require('webpack-utf8-bom');

module.exports = {
  mode: "development",
  entry: {
    saturn: "./src/saturn.js",
    dev: "./src/dev.js",
    devtools: "./src/devtools.js",
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "./"), // where dev server will look for static files, not compiled
    publicPath: "/", //relative path to output path where dev server will look for compiled files
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"), // base path where to send compiled assets
    publicPath: "/", // base path where referenced files will be look for
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"), // shortcut to reference src folder from anywhere
    },
  },
  plugins: [
    new CopyPlugin([
      { from: "src/saturn.html", to: "saturn.html" },
      { from: "src/devtools.html", to: "devtools.html" },
      { from: "src/dev.html", to: "dev.html" },
      { from: "src/manifest.json", to: "manifest.json" },
      { from: "src/images", to: "images" },
    ]),
    // Believe or not, this plugin is required to properly render emojis in Chrome extensions.
    new BomPlugin(true)
  ],
  module: {
    rules: [
      {
        // config for es6 jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
