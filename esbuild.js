require("esbuild")
  .build({
    entryPoints: ["./extension_dist/background.js"],
    bundle: true,
    platform: "browser",
    target: ["es2020"],
    outfile: "./extension_dist/background.js",
    external: ["node_modules"],
    allowOverwrite: true
  })
  .catch((e) => console.error(e.message))
