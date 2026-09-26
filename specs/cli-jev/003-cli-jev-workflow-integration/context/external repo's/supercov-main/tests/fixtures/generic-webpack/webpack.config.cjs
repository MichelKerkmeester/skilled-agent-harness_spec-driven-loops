const path = require("node:path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/permission.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "permission.cjs",
    library: { type: "commonjs2" },
  },
};
