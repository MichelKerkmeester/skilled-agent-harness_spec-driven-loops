#!/usr/bin/env node

import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-pypi-registry-"));

try {
  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
    filter: (source) => !source.endsWith("/.supercov"),
  });
  const result = spawnSync(
    "uvx",
    [
      "--refresh-package",
      "supercov-cli",
      "--from",
      `supercov-cli==${version}`,
      "supercov",
      "--",
      process.execPath,
      "--test",
    ],
    { cwd: project, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /\[coverage\] evidence:/);
  console.log(`[pypi-registry] supercov-cli ${version} completed a real run`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
