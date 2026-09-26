#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { relative, resolve } from "node:path";

const repository = resolve(new URL("..", import.meta.url).pathname);
const configured = process.env.SUPERCOV_CONTRACT_ENGINE;
const engine = configured
  ? JSON.parse(configured)
  : [process.execPath, resolve(repository, "bin/supercov.js")];
const localBinary = resolve(
  repository,
  "target/debug",
  `supercov${process.platform === "win32" ? ".exe" : ""}`,
);
if (!Array.isArray(engine) || engine.some((part) => typeof part !== "string"))
  throw new Error("SUPERCOV_CONTRACT_ENGINE must be a JSON argv array");

function execute(cwd, args) {
  const result = spawnSync(engine[0], [...engine.slice(1), ...args], {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
    env: {
      ...process.env,
      ...(!configured && existsSync(localBinary)
        ? { SUPERCOV_RUST_BINARY: localBinary }
        : {}),
      SUPERCOV_DIAGNOSTIC_INTERVAL_MS: "10000",
      SUPERCOV_COMMAND_TIMEOUT_MS: "120000",
    },
    timeout: 130_000,
  });
  if (result.error) throw result.error;
  return result;
}

function projectFiles(root, directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".supercov", "node_modules"].includes(entry.name)) return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? projectFiles(root, path) : [path];
  });
}

function sourceFingerprint(root) {
  return createHash("sha256")
    .update(
      projectFiles(root)
        .sort()
        .map((path) => `${relative(root, path)}\0${readFileSync(path, "utf8")}\0`)
        .join(""),
    )
    .digest("hex");
}

function json(result, label) {
  if (result.status !== 0)
    throw new Error(`${label} failed (${result.status}):\n${result.stderr}\n${result.stdout}`);
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${label} did not return one JSON value: ${result.stdout}`, { cause: error });
  }
}

const temporary = mkdtempSync(resolve(tmpdir(), "supercov-engine-contract-"));
try {
  const project = resolve(temporary, "project");
  const fixture = resolve(repository, "tests/fixtures/no-build-node");
  cpSync(fixture, project, {
    recursive: true,
    filter: (path) =>
      !relative(fixture, path)
        .split(/[\\/]/)
        .some((segment) => segment === ".supercov"),
  });
  const before = sourceFingerprint(project);
  const help = execute(project, ["--help"]);
  if (help.status !== 0) throw new Error(`help failed: ${help.stderr}`);

  const run = execute(project, ["--", "npm", "test"]);
  if (run.status !== 0)
    throw new Error(`coverage run failed (${run.status}):\n${run.stderr}\n${run.stdout}`);
  const runIds = readdirSync(resolve(project, ".supercov/runs")).sort();
  if (runIds.length !== 1) throw new Error(`expected one run, received ${runIds}`);
  const runId = runIds[0];
  const runDirectory = resolve(project, ".supercov/runs", runId);
  const runFiles = readdirSync(runDirectory).sort();
  const metadata = JSON.parse(readFileSync(resolve(runDirectory, "run.json"), "utf8"));
  const summary = json(
    execute(project, ["runs", runId, "--json"]),
    "coverage summary",
  );
  const files = json(
    execute(project, ["runs", runId, "files", "--json"]),
    "coverage files",
  );
  const after = sourceFingerprint(project);

  const snapshot = {
    contractVersion: 1,
    help: {
      exits: help.status,
      hasRunCommand: help.stdout.includes("supercov -- <test command>"),
      hasResourceQueries: help.stdout.includes("supercov runs <run-id> [resource]"),
      hasResidentServeCommand: /^\s*supercov serve\b/m.test(help.stdout),
    },
    execution: {
      exitCode: run.status,
      sourceUnchanged: before === after,
      publishedFiles: runFiles,
      looseEvidenceRetained: existsSync(resolve(project, ".supercov/evidence", runId)),
      terminalWorkRetained: existsSync(resolve(project, ".supercov/work", runId)),
      metadata: {
        testExitCode: metadata.testExitCode,
        isolatedBuild: metadata.isolatedBuild,
        evidenceSchemaVersion: metadata.rawEvidence?.schemaVersion,
        evidenceFormat: metadata.rawEvidence?.format,
        evidenceFile: metadata.rawEvidence?.file,
        evidenceSizeMatches:
          metadata.rawEvidence?.compressedBytes ===
          statSync(resolve(runDirectory, "evidence.raw.gz")).size,
        timingFields: Object.keys(metadata.timings ?? {}).sort(),
      },
    },
    summary: {
      schemaVersion: summary.schemaVersion,
      ok: summary.ok,
      command: summary.command,
      valid: summary.data?.valid,
      structurallyComplete: summary.data?.structurallyComplete,
      complete: summary.data?.complete,
      coverage: summary.data?.coverage,
      measurement: summary.data?.measurement,
      tests: summary.data?.tests,
      outcomes: summary.data?.testOutcomes,
    },
    files: {
      schemaVersion: files.schemaVersion,
      ok: files.ok,
      command: files.command,
      pagination: files.pagination,
      data: files.data ? { ...files.data, run: "<run-id>" } : files.data,
    },
  };

  if (process.argv.includes("--emit")) {
    process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
  } else {
    const golden = JSON.parse(
      readFileSync(resolve(repository, "tests/golden/engine-contract-v1.json"), "utf8"),
    );
    if (JSON.stringify(snapshot) !== JSON.stringify(golden)) {
      throw new Error(
        `engine contract differs from v1 golden\nactual:\n${JSON.stringify(snapshot, null, 2)}\nexpected:\n${JSON.stringify(golden, null, 2)}`,
      );
    }
    console.log(
      `[engine-contract] ${engine.join(" ")}: frozen v1 run/store/query contract passed`,
    );
  }
} finally {
  rmSync(temporary, {
    recursive: true,
    force: true,
    maxRetries: 20,
    retryDelay: 25,
  });
}
