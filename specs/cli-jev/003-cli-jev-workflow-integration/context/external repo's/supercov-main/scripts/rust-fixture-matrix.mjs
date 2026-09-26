#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const binary = resolve(
  "target/debug",
  process.platform === "win32" ? "supercov.exe" : "supercov",
);
const rustEnvironment = {
  ...process.env,
  SUPERCOV_RUST_BINARY: binary,
};

function run(arguments_, extraEnvironment = {}) {
  const result = spawnSync(npm, arguments_, {
    stdio: "inherit",
    env: { ...rustEnvironment, ...extraEnvironment },
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${npm} ${arguments_.join(" ")} failed with exit ${result.status ?? "signal"}`,
    );
}

function runNode(arguments_, extraEnvironment = {}) {
  const result = spawnSync(process.execPath, arguments_, {
    stdio: "inherit",
    env: { ...rustEnvironment, ...extraEnvironment },
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${process.execPath} ${arguments_.join(" ")} failed with exit ${result.status ?? "signal"}`,
    );
}

// Chromium exercises every currently supported adapter/build fixture.
run(["--prefix", "tests/fixtures/generic-playwright", "run", "test:coverage"]);
for (const script of [
  "opaque-runner-integration.mjs",
  "opaque-esm-integration.mjs",
  "workspaces-attribution-integration.mjs",
  "node-test-integration.mjs",
  "generic-build-integration.mjs",
  "next-integration.mjs",
  "distributed-merge-integration.mjs",
  "agent-query-eval.mjs",
]) {
  runNode([`scripts/${script}`]);
}
run(["run", "test:isolation"]);
run(["run", "test:watchdog"]);
for (const browser of ["firefox", "webkit"]) {
  run(
    ["--prefix", "tests/fixtures/generic-playwright", "run", "test:coverage"],
    { SUPERCOV_BROWSER: browser },
  );
}
runNode(["scripts/rust-syntax-matrix.mjs"]);

console.log(
  "[rust-fixture-matrix] Rust engine passed the adapter and independent syntax matrices in Node, Chromium, Firefox, and WebKit",
);
