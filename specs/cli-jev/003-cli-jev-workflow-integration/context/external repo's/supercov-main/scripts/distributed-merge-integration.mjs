import { readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { coverageQuery, requireSupercov } from "./coverage-test-helpers.mjs";

const root = resolve("tests/fixtures/generic-node");
rmSync(resolve(root, ".supercov"), { recursive: true, force: true });
for (const pattern of ["admin|both", "owner|neither"]) {
  requireSupercov(
    root,
    ["--", "node", "--test", `--test-name-pattern=${pattern}`],
    { stdio: "inherit" },
  );
}
const shards = readdirSync(resolve(root, ".supercov/runs")).sort();
if (shards.length !== 2) throw new Error(`expected two local shards, received ${shards}`);
requireSupercov(root, ["merge", ...shards], { stdio: "inherit" });
const runs = readdirSync(resolve(root, ".supercov/runs")).sort();
const merged = runs.find((id) => !shards.includes(id));
if (!merged) throw new Error("merge did not publish a new run");
const summary = coverageQuery(root, merged, "--filter", "passed").data;
if (summary.coverage.conditionCoveragePct !== 100)
  throw new Error(`merged passed-only MC/DC was ${summary.coverage.conditionCoveragePct}%`);
console.log(`[merge] ${merged}: two compatible shards merged to 100% passed-only MC/DC`);
