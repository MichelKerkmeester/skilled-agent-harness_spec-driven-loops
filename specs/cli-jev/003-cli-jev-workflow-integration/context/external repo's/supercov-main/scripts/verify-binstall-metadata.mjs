#!/usr/bin/env node
// Prove the cargo-binstall metadata resolves to files that exist: expand each
// target's templated pkg-url the way binstall does, ask GitHub for the asset,
// and check that the archive really holds the binary at the templated bin-dir.
//
// `cargo install supercov` compiles the engine, minutes of it; binstall fetches
// the same tarball the npm package ships instead. That only works while the
// asset names, the release tag, and the path inside the archive all agree, and
// nothing else fails when they drift -- binstall simply falls back to
// compiling, quietly. This is the check that would notice.
//
// Usage: node scripts/verify-binstall-metadata.mjs [version]
//        (defaults to the version in package.json; --offline skips the network)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = process.argv.find((argument, index) => index >= 2 && !argument.startsWith("--"))
  ?? JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
const offline = process.argv.includes("--offline");

const metadata = JSON.parse(
  execFileSync("cargo", ["metadata", "--no-deps", "--format-version", "1"], {
    cwd: repository,
    encoding: "utf8",
    maxBuffer: 1 << 26,
  }),
);
const crate = metadata.packages.find((entry) => entry.name === "supercov");
assert(crate, "the supercov crate is missing from the workspace");
const binstall = crate.metadata?.binstall;
assert(binstall, "crates/supercov-cli/Cargo.toml has no [package.metadata.binstall]");
assert.equal(binstall["pkg-fmt"], "tgz", "the native artifacts are gzipped tarballs");

const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);
// Every target the release builds must be installable this way; a target with
// no override would silently fall back to compiling from source.
const overrides = Object.keys(binstall.overrides ?? {});
assert.deepEqual(
  overrides.slice().sort(),
  registry.targets.map((target) => target.rustTarget).sort(),
  "every native target needs a binstall override",
);

// binstall's own template syntax: `{ name }` with the spaces.
function expand(template, values) {
  return template.replace(/\{ *([a-z-]+) *\}/g, (whole, key) => {
    assert(key in values, `unsupported template variable ${whole}`);
    return values[key];
  });
}

let checked = 0;
for (const target of registry.targets) {
  const values = {
    repo: crate.repository.replace(/\.git$/, ""),
    version,
    name: "supercov",
    bin: "supercov",
    target: target.rustTarget,
    "binary-ext": target.platform === "win32" ? ".exe" : "",
    "archive-suffix": ".tgz",
  };
  const url = expand(binstall.overrides[target.rustTarget]["pkg-url"], values);
  const binaryPath = expand(binstall["bin-dir"], values);
  // The archive is an npm package: the binary is the one the npm launcher runs.
  assert.equal(
    binaryPath,
    `package/bin/${target.executable}`,
    `${target.rustTarget}: bin-dir must name the executable inside the tarball`,
  );
  if (!offline) {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    assert.equal(response.status, 200, `${target.rustTarget}: ${url} answered ${response.status}`);
  }
  checked += 1;
  console.log(`[binstall] ${target.rustTarget} -> ${url.split("/").at(-1)} :: ${binaryPath}`);
}
console.log(
  `[binstall] ${checked} targets resolve to ${offline ? "correctly templated" : "existing"} release assets`,
);
