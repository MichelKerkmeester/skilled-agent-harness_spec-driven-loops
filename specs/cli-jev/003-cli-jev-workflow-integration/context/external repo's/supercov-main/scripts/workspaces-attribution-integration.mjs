#!/usr/bin/env node
// A monorepo runner spawns test processes with the package directory as cwd,
// several process generations below the wrapped command. Per-test evidence
// must still reach the run: this fixture reproduced the shape in which every
// test record and per-test probe hit was silently lost (tests 0, coverage
// execution-only) because the evidence directory was resolved against cwd.

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { coverageQuery, localRustEnvironment } from "./coverage-test-helpers.mjs";

const fixture = resolve("tests/fixtures/generic-workspaces");
rmSync(resolve(fixture, ".supercov"), { recursive: true, force: true });

const result = spawnSync(
  process.execPath,
  [resolve("bin/supercov.js"), "--", "npm", "test"],
  { cwd: fixture, env: { ...process.env, ...localRustEnvironment }, encoding: "utf8", stdio: "pipe" },
);
if (result.status !== 0) {
  throw new Error(
    `workspaces fixture coverage failed:\n${result.stderr}\n${result.stdout}`,
  );
}

const runsRoot = resolve(fixture, ".supercov/runs");
const runIds = existsSync(runsRoot) ? readdirSync(runsRoot).sort() : [];
if (runIds.length !== 1)
  throw new Error(`expected one workspaces coverage run, received ${runIds}`);
const runId = runIds[0];
const summary = coverageQuery(fixture, runId).data;

if (summary.tests !== 3)
  throw new Error(
    `expected 3 recorded tests from the package-cwd runner, received ${summary.tests}`,
  );
if (summary.coverage.lines.percentage !== 100)
  throw new Error(
    `expected complete line coverage, received ${summary.coverage.lines.percentage}`,
  );
if (summary.coverage.branches.covered < 3)
  throw new Error(
    `expected per-test branch evidence, received ${summary.coverage.branches.covered} covered branches`,
  );

console.log(
  `[workspaces-attribution] run ${runId}: 3 tests attributed from a package-cwd runner, lines 100%`,
);
