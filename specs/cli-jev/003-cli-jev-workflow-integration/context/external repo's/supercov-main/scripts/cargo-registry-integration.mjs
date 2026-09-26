#!/usr/bin/env node

import assert from "node:assert/strict";
import { chmodSync, cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-cargo-registry-"));

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: "utf8", ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

try {
  run("cargo", [
    "install",
    "supercov",
    "--version",
    `=${version}`,
    "--root",
    temporary,
    "--locked",
  ]);
  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
  });
  const executable = resolve(
    temporary,
    "bin",
    process.platform === "win32" ? "supercov.exe" : "supercov",
  );
  if (process.platform !== "win32") chmodSync(executable, 0o755);
  const covered = run(executable, ["--", process.execPath, "--test"], {
    cwd: project,
  });
  assert.match(covered.stdout, /\[coverage\] evidence:/);
  console.log(`[cargo-registry] supercov ${version} installed and completed a real run`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
