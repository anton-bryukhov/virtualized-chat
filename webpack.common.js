const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_BASE_URL": JSON.stringify("http://localhost:3000"),
    }),
  ],
};
