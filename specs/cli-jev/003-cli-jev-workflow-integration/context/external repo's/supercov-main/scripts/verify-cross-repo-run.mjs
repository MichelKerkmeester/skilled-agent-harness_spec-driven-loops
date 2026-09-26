import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { coverageQuery } from "./coverage-test-helpers.mjs";

const root = process.cwd();
const runId = readdirSync(resolve(root, ".supercov/runs")).sort().at(-1);
if (!runId) throw new Error("external repository did not publish a coverage run");
const directory = resolve(root, ".supercov/runs", runId);
const metadata = JSON.parse(readFileSync(resolve(directory, "run.json"), "utf8"));
if (metadata.testExitCode !== 0) {
  throw new Error(`external test command exited ${metadata.testExitCode}`);
}
const summary = coverageQuery(root, runId).data;
if (summary.coverage.lines.total === 0 || summary.coverage.statements.total === 0) {
  throw new Error("external run produced no first-party coverage denominator");
}
const scope = coverageQuery(root, runId, "scope").data;
if (!scope.entries || scope.entries.length === 0) {
  throw new Error("external run did not retain an auditable source inventory");
}
console.log(
  `[cross-repo] ${runId}: ${summary.coverage.lines.covered}/${summary.coverage.lines.total} lines, ${summary.coverage.branches.covered}/${summary.coverage.branches.total} branches, ${summary.coverage.coveredConditions}/${summary.coverage.conditions} MC/DC conditions`,
);
