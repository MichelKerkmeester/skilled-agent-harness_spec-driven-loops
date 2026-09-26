import { mkdir, writeFile } from "node:fs/promises";
import { transformFile } from "@swc/core";

await mkdir("dist", { recursive: true });
const transformed = await transformFile("src/permission.js", {
  jsc: { parser: { syntax: "ecmascript" }, target: "es2022" },
  module: { type: "es6" },
});
await writeFile("dist/permission.js", transformed.code);
