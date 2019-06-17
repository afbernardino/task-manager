const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
  const isProduction = env === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "public", "dist"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === "development"
              }
            },
            "css-loader"
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFileName: "[id].css"
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" })
    ],
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "public", "dist"),
      historyApiFallback: true,
      hot: true,
      port: 3001
    }
  };
};
