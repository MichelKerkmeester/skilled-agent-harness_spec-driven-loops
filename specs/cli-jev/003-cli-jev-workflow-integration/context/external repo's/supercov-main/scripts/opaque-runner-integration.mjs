#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { coverageQuery, localRustEnvironment } from "./coverage-test-helpers.mjs";

const fixture = resolve("tests/fixtures/generic-playwright");
const runsRoot = resolve(fixture, ".supercov/runs");
const before = new Set(existsSync(runsRoot) ? readdirSync(runsRoot) : []);
const result = spawnSync(
  process.execPath,
  [resolve("bin/supercov.js"), "--", "npm", "run", "test:opaque"],
  { cwd: fixture, env: { ...process.env, ...localRustEnvironment }, encoding: "utf8", stdio: "pipe" },
);
if (result.status !== 0) {
  throw new Error(
    `opaque runner coverage failed:\n${result.stderr}\n${result.stdout}`,
  );
}
const runIds = readdirSync(runsRoot)
  .filter((id) => !before.has(id))
  .sort();
if (runIds.length !== 1)
  throw new Error(`expected one opaque runner coverage run, received ${runIds}`);
const runId = runIds[0];
const metadata = JSON.parse(
  readFileSync(resolve(runsRoot, runId, "run.json"), "utf8"),
);
if (metadata.instrumentedBuildCache?.reused !== true)
  throw new Error("test-command-only change rebuilt unchanged instrumented source");
const evidencePath = resolve(runsRoot, runId, "evidence.raw.gz");
if (existsSync(resolve(runsRoot, runId, "report.json.gz")))
  throw new Error("opaque runner persisted a derived report");
if (!existsSync(evidencePath)) throw new Error("opaque runner omitted raw evidence");
const summary = coverageQuery(fixture, runId).data;
for (const metric of ["lines", "statements", "functions", "branches"]) {
  if (summary.coverage[metric].percentage !== 100)
    throw new Error(`${metric} coverage was not complete`);
}
if (summary.coverage.conditionCoveragePct !== 100)
  throw new Error("MC/DC coverage was not complete");
if (summary.transport.workspaceCapabilities !== 1)
  throw new Error("opaque workspace capability was not discovered exactly once");
if (summary.transport.remoteLaunches !== 1)
  throw new Error("opaque remote launch was not intercepted exactly once");
if (readFileSync(resolve("runtime/javascript/launchSupervisor.mjs"), "utf8").includes("supermachine"))
  throw new Error("provider-specific behavior leaked into the public fixture");

console.log(
  `[opaque-runner] run ${runId}: reused build, generic remote launch, 100% coverage`,
);
