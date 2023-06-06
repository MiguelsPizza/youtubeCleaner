module.exports = {
  entry: "./extension_dist/background.js", // path to your main .js file
  output: {
    path: __dirname + "/extension_dist",
    filename: "background.js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
}
