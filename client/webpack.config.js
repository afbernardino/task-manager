const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "env/dev.env" });
}

module.exports = env => {
  const isProduction = env === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "public", "dist"),
      filename: "bundle.js",
      publicPath: "/"
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
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
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new webpack.DefinePlugin({
        "process.env.TASKS_API_ADDRESS": JSON.stringify(
          process.env.TASKS_API_ADDRESS
        ),
        "process.env.TASKS_API_PORT": JSON.stringify(process.env.TASKS_API_PORT)
      })
    ],
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "public", "dist"),
      historyApiFallback: true,
      hot: true,
      port: 3001,
      stats: "errors-warnings",
      clientLogLevel: "warn"
    }
  };
};
