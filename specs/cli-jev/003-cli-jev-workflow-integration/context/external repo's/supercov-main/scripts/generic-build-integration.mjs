import { rmSync } from "node:fs";
import { delimiter, resolve } from "node:path";
import {
  coverageQuery,
  latestRun,
  requireSupercov,
  runMetadata,
} from "./coverage-test-helpers.mjs";

for (const adapter of ["esbuild", "webpack", "swc"]) {
  const root = resolve(`tests/fixtures/generic-${adapter}`);
  rmSync(resolve(root, ".supercov"), { recursive: true, force: true });
  for (const attempt of ["fresh", "reused"]) {
    requireSupercov(root, ["--", "npm", "test"], {
      stdio: "inherit",
      env: {
        ...process.env,
        PATH: `${resolve("node_modules/.bin")}${delimiter}${process.env.PATH ?? ""}`,
        ...(adapter === "swc" ? { SUPERCOV_SOURCE_ROOTS: "src" } : {}),
      },
    });
    const runId = latestRun(root);
    const metadata = runMetadata(root, runId);
    const summary = coverageQuery(root, runId, "--filter", "passed").data;
    if (summary.coverage.conditionCoveragePct !== 100)
      throw new Error(
        `${adapter} ${attempt} passed-only MC/DC was ${summary.coverage.conditionCoveragePct}%`,
      );
    if (metadata.instrumentedBuildCache?.reused !== (attempt === "reused"))
      throw new Error(`${adapter} ${attempt} run had unexpected build-cache state`);
  }
  console.log(
    `[generic-build] ${adapter}: fresh and reused builds kept four attributed tests at 100% MC/DC`,
  );
}
