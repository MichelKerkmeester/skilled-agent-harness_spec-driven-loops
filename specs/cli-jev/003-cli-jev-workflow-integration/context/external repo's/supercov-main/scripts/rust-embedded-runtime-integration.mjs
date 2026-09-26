#!/usr/bin/env node

import assert from "node:assert/strict";
import { chmodSync, cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-embedded-runtime-"));

try {
  const executableName = process.platform === "win32" ? "supercov.exe" : "supercov";
  const executable = resolve(temporary, "bin", executableName);
  cpSync(
    resolve(repository, "target", "debug", executableName),
    executable,
    { recursive: false },
  );
  if (process.platform !== "win32") chmodSync(executable, 0o755);

  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
  });
  const environment = { ...process.env };
  delete environment.SUPERCOV_RUST_BINARY;
  const result = spawnSync(executable, ["--", process.execPath, "--test"], {
    cwd: project,
    env: environment,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /\[coverage\] evidence:/);
  assert.match(result.stderr, /\[supercov\] timings/);
  console.log("[rust-embedded-runtime] standalone binary completed a real coverage run");
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
