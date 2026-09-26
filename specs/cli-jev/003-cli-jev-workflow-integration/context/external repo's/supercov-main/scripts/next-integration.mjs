import { rmSync } from "node:fs";
import { delimiter, resolve } from "node:path";
import { coverageQuery, latestRun, requireSupercov } from "./coverage-test-helpers.mjs";

const root = resolve("tests/fixtures/generic-next");
rmSync(resolve(root, ".supercov"), { recursive: true, force: true });
requireSupercov(root, ["--", "npm", "test"], {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${resolve("node_modules/.bin")}${delimiter}${process.env.PATH ?? ""}`,
  },
});
const runId = latestRun(root);
const summary = coverageQuery(root, runId).data;
if (summary.coverage.conditionCoveragePct !== 100)
  throw new Error(`Next MC/DC was ${summary.coverage.conditionCoveragePct}%`);
console.log(`[generic-build] Next: production build and request tests passed at 100% MC/DC`);
