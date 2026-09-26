#!/usr/bin/env node

import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-rubygem-registry-"));
const homebrewGem = "/opt/homebrew/opt/ruby/bin/gem";
const gemCommand =
  process.env.SUPERCOV_GEM_COMMAND ??
  (process.platform === "darwin" && existsSync(homebrewGem) ? homebrewGem : "gem");

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: "utf8", ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

try {
  const gemHome = resolve(temporary, "gem-home");
  const bindir = resolve(temporary, "bin");
  run(gemCommand, [
    "install",
    "supercov",
    "--version",
    `=${version}`,
    "--platform",
    "arm64-darwin",
    "--no-document",
    "--install-dir",
    gemHome,
    "--bindir",
    bindir,
  ]);

  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
    filter: (source) => !source.endsWith("/.supercov"),
  });
  const covered = run(resolve(bindir, "supercov"), ["--", process.execPath, "--test"], {
    cwd: project,
    env: { ...process.env, GEM_HOME: gemHome, GEM_PATH: gemHome },
  });
  assert.match(covered.stdout, /\[coverage\] evidence:/);
  console.log(`[rubygem-registry] supercov ${version} completed a real run`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
