#!/usr/bin/env node

import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repository = resolve(import.meta.dirname, "..");
const mainPackage = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8"));
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const rustTarget = option("--target");
const binary = option("--binary");
const output = option("--out");
if (!rustTarget || !binary || !output) {
  throw new Error("usage: package-native.mjs --target <rust-target> --binary <path> --out <output-directory>");
}
const target = registry.targets.find(candidate => candidate.rustTarget === rustTarget);
if (!target) throw new Error(`unknown native Rust target: ${rustTarget}`);
if (!statSync(binary).isFile()) throw new Error(`native binary is not a regular file: ${binary}`);

const packageRoot = resolve(output, target.package);
if (existsSync(packageRoot)) {
  throw new Error(`refusing to replace an existing native package directory: ${packageRoot}`);
}
mkdirSync(resolve(packageRoot, "bin"), { recursive: true });
const destination = resolve(packageRoot, "bin", target.executable);
copyFileSync(binary, destination);
if (target.platform !== "win32") chmodSync(destination, 0o755);

const manifest = {
  name: target.package,
  version: mainPackage.version,
  description: `Native Supercov engine for ${target.rustTarget}`,
  license: mainPackage.license,
  repository: mainPackage.repository,
  os: [target.platform],
  cpu: [target.arch],
  ...(target.libc ? { libc: [target.libc === "gnu" ? "glibc" : target.libc] } : {}),
  preferUnplugged: true,
  files: ["bin"],
};
writeFileSync(resolve(packageRoot, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
copyFileSync(resolve(repository, "LICENSE"), resolve(packageRoot, "LICENSE"));
writeFileSync(
  resolve(packageRoot, "README.md"),
  `# ${target.package}\n\nPlatform binary used by [supercov](https://www.npmjs.com/package/supercov). Install \`supercov\`, not this package directly.\n`,
);
process.stdout.write(`${packageRoot}\n`);
