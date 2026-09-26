import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { relative, resolve } from "node:path";
import { repository } from "./coverage-test-helpers.mjs";

const temporary = mkdtempSync(resolve(tmpdir(), "supercov-agent-query-"));
const fixture = resolve(temporary, "project");
const fixtureTemplate = resolve(repository, "tests/fixtures/generic-node");
cpSync(fixtureTemplate, fixture, {
  recursive: true,
  filter: (path) =>
    !relative(fixtureTemplate, path)
      .split(/[\\/]/)
      .some((part) => part === ".supercov"),
});
process.once("exit", () => rmSync(temporary, { recursive: true, force: true }));
const cli = resolve("bin/supercov.js");
const runsRoot = resolve(fixture, ".supercov/runs");
const rustBinary = resolve(
  repository,
  "target/debug",
  `supercov${process.platform === "win32" ? ".exe" : ""}`,
);
const queryEnvironment = { ...process.env, SUPERCOV_RUST_BINARY: rustBinary };

function storedRun(id) {
  const directory = resolve(runsRoot, id);
  const metadata = JSON.parse(readFileSync(resolve(directory, "run.json"), "utf8"));
  const summary = query(id);
  return { id, directory, metadata, summary };
}

function query(runId, ...args) {
  const result = spawnSync(
    process.execPath,
    [cli, "runs", runId, ...args, "--json"],
    { cwd: fixture, env: queryEnvironment, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `query failed: ${args.join(" ")}\n${result.stdout}\n${result.stderr}`,
    );
  }
  if (Buffer.byteLength(result.stdout) > 64 * 1024) {
    throw new Error(
      `${args.join(" ")} exceeded the 64 KiB agent-response budget`,
    );
  }
  const envelope = JSON.parse(result.stdout);
  if (envelope.schemaVersion !== 1 || envelope.ok !== true) {
    throw new Error(`invalid agent success envelope: ${result.stdout}`);
  }
  if (!envelope.data || typeof envelope.data !== "object") {
    throw new Error(`agent response omitted object data: ${result.stdout}`);
  }
  if (envelope.pagination) {
    const page = envelope.pagination;
    if (
      !Number.isSafeInteger(page.offset) ||
      !Number.isSafeInteger(page.limit) ||
      !Number.isSafeInteger(page.returned) ||
      !Number.isSafeInteger(page.total) ||
      typeof page.hasMore !== "boolean" ||
      (page.nextOffset !== null && !Number.isSafeInteger(page.nextOffset))
    ) {
      throw new Error(`invalid agent pagination envelope: ${result.stdout}`);
    }
  }
  return { ...envelope.data, pagination: envelope.pagination };
}

function failingQuery(runId, ...args) {
  const result = spawnSync(
    process.execPath,
    [cli, "runs", runId, ...args, "--json"],
    { cwd: fixture, env: queryEnvironment, encoding: "utf8" },
  );
  if (result.status !== 2 || result.stderr !== "") {
    throw new Error(`agent failure did not use a clean status-2 JSON channel`);
  }
  const envelope = JSON.parse(result.stdout);
  if (
    envelope.schemaVersion !== 1 ||
    envelope.ok !== false ||
    typeof envelope.error?.code !== "string" ||
    typeof envelope.error?.retryable !== "boolean"
  ) {
    throw new Error(`invalid agent failure envelope: ${result.stdout}`);
  }
  return envelope;
}

function requirePagination(response, label) {
  if (!response.pagination || response.pagination.limit !== 20) {
    throw new Error(`${label} omitted the default pagination contract`);
  }
}

for (const command of [
  [
    "--",
    process.execPath,
    "--test",
    "--test-name-pattern",
    "admin is allowed|neither is denied",
  ],
  ["--", "npm", "test"],
]) {
  const result = spawnSync(process.execPath, [cli, ...command], {
    cwd: fixture,
    env: queryEnvironment,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `agent evaluation fixture failed: ${command.join(" ")}\n${result.error ?? ""}\n${result.stderr ?? ""}\n${result.stdout ?? ""}`,
    );
  }
}

const runs = readdirSync(runsRoot).sort().map(storedRun);
const partial = runs.find(
  ({ summary }) =>
    summary.tests > 0 &&
    summary.coverage.conditionCoveragePct > 0 &&
    summary.coverage.conditionCoveragePct < 100,
);
const complete = runs.find(
  ({ summary }) => summary.coverage.conditionCoveragePct === 100,
);
if (!partial || !complete) {
  throw new Error("agent evaluation requires one partial and one complete fixture run");
}

const summary = query(partial.id);
if (summary.filesWithGaps < 1 || summary.tests < 1 || summary.pagination) {
  throw new Error("summary did not expose the partial run's remaining work");
}

const scope = query(partial.id, "scope");
requirePagination(scope, "scope");
if (scope.entries.length > 20 || scope.counts.included < 1) {
  throw new Error("scope query was not bounded or omitted included source");
}

const files = query(partial.id, "files");
const gaps = query(partial.id, "gaps");
requirePagination(files, "files");
requirePagination(gaps, "gaps");
if (files.files.length > 20 || gaps.gaps.length < 1 || gaps.gaps.length > 20) {
  throw new Error("file queries did not provide a bounded gap inventory");
}

const file = gaps.gaps[0].file;
const detail = query(partial.id, "file", file);
requirePagination(detail, "file detail");
if (detail.gapLines.length < 1 || detail.gapLines.length > 20) {
  throw new Error("file query did not expose bounded, actionable gap lines");
}

const mcdcGaps = query(partial.id, "gaps", "--metric", "mcdc");
requirePagination(mcdcGaps, "MC/DC gap inventory");
if (
  mcdcGaps.metric !== "mcdc" ||
  mcdcGaps.gaps.length < 1 ||
  mcdcGaps.gaps.some(
    (gap) => gap.missingMcdcConditions === 0 && gap.measurementLimitations === 0,
  )
) {
  throw new Error("metric-filtered gaps included unrelated coverage work");
}
const mcdcDetail = query(
  partial.id,
  "file",
  mcdcGaps.gaps[0].file,
  "--metric",
  "mcdc",
);
const mcdcObligations = mcdcDetail.gapLines.flatMap((gap) => gap.obligations);
if (
  mcdcDetail.metric !== "mcdc" ||
  mcdcObligations.some((obligation) => obligation.kind !== "mcdc")
) {
  throw new Error("metric-filtered file detail included unrelated obligations");
}

const grouped = query(
  partial.id,
  "file",
  mcdcGaps.gaps[0].file,
  "--metric",
  "mcdc",
  "--group",
  "decision",
);
requirePagination(grouped, "grouped file detail");
if (
  grouped.group !== "decision" ||
  typeof grouped.totals?.decisions !== "number" ||
  !Array.isArray(grouped.decisions) ||
  grouped.decisions.length < 1 ||
  grouped.decisions.some(
    (row) =>
      typeof row.id !== "string" ||
      !Number.isSafeInteger(row.line) ||
      !Number.isSafeInteger(row.conditions) ||
      !Number.isSafeInteger(row.missingConditions) ||
      row.missingConditions < 1 ||
      row.missingConditions > row.conditions ||
      typeof row.source !== "string",
  )
) {
  throw new Error("grouped file query did not expose per-decision missing counts");
}
const sortedGrouped = query(
  partial.id,
  "file",
  mcdcGaps.gaps[0].file,
  "--group",
  "decision",
  "--sort",
  "missing",
);
for (let index = 1; index < sortedGrouped.decisions.length; index += 1) {
  const previous = sortedGrouped.decisions[index - 1];
  const current = sortedGrouped.decisions[index];
  if (previous.missingConditions < current.missingConditions) {
    throw new Error("--sort missing did not order decisions by missing count");
  }
}

const missingFile = failingQuery(partial.id, "file", "src/does-not-exist.ts");
if (missingFile.command !== "coverage.file" || missingFile.error.code !== "SOURCE_NOT_FOUND") {
  throw new Error("file query did not expose a stable structured error code");
}

const legacyCoverageNamespace = spawnSync(
  process.execPath,
  [cli, "runs", partial.id, "coverage", "--json"],
  { cwd: fixture, env: queryEnvironment, encoding: "utf8" },
);
if (legacyCoverageNamespace.status === 0) {
  throw new Error("the removed coverage namespace must not remain as an alias");
}
const malformedEnvelope = JSON.parse(legacyCoverageNamespace.stdout);
if (
  malformedEnvelope.ok !== false ||
  malformedEnvelope.error?.code !== "UNKNOWN_COMMAND" ||
  !malformedEnvelope.error.message.includes("Unknown run query: coverage")
) {
  throw new Error("malformed runs query did not return a structured usage error");
}

const decisionId = grouped.decisions[0]?.id;
if (!decisionId) throw new Error("partial run did not contain an MC/DC decision");
const decisionDetail = query(partial.id, "decision", decisionId);
requirePagination(decisionDetail, "decision detail");
if (
  decisionDetail.decisions?.length !== 1 ||
  !Array.isArray(decisionDetail.decisions[0].conditions) ||
  decisionDetail.paginationAppliesTo !==
    "conditions, vectorObservations, and tests independently within each decision" ||
  typeof decisionDetail.decisions[0].totals?.conditions !== "number"
) {
  throw new Error("decision query did not expose conditions and witnesses");
}

const line = detail.gapLines.find((gap) => Number.isSafeInteger(gap.line));
if (!line) throw new Error("partial run did not contain a queryable source line");
const lineDetail = query(partial.id, "line", `${file}:${line.line}`);
requirePagination(lineDetail, "line attribution");
if (!Array.isArray(lineDetail.tests)) {
  throw new Error("line query did not expose per-test attribution");
}

const testId = lineDetail.tests[0]?.id;
if (!testId) throw new Error("partial run did not contain a queryable test");
const testDetail = query(partial.id, "test", testId);
requirePagination(testDetail, "test detail");
if (testDetail.tests?.length !== 1 || testDetail.tests[0].id !== testId) {
  throw new Error("test query did not resolve an exact test ID");
}
if (
  testDetail.paginationAppliesTo !==
    "lines, hits/hitDetails, decisions, and phases independently within the test" ||
  testDetail.tests[0].hitDetails.some(
    (hit) => typeof hit.id !== "string" || typeof hit.obligation !== "string",
  ) ||
  testDetail.tests[0].decisions.some(
    (decision) => !decision.meta?.file || !Number.isSafeInteger(decision.meta.line),
  )
) {
  throw new Error("test query exposed opaque evidence without source metadata");
}

const minimized = query(
  complete.id,
  "minimize",
  "--filter",
  "passed",
  "--metric",
  "mcdc",
);
requirePagination(minimized, "minimum test set");
if (!minimized.optimal || minimized.summary.conditionCoveragePct !== 100) {
  throw new Error("minimizer did not prove an exact 100% MC/DC test subset");
}
if (minimized.selectedCount >= minimized.totalCandidateTests) {
  throw new Error("minimizer failed to eliminate the redundant MC/DC vector");
}

for (const run of runs) {
  for (const legacy of ["report.html", "report.json", "mcdc-report.html", "mcdc-report.json"]) {
    if (existsSync(resolve(run.directory, legacy))) {
      throw new Error(`run ${run.id} retained forbidden derived artifact ${legacy}`);
    }
  }
}

console.log(
  `[agent-eval] navigated ${partial.id} through bounded scope/gap/file/decision/line/test queries; ${complete.id} proved an exact ${minimized.selectedCount}/${minimized.totalCandidateTests} MC/DC subset`,
);
