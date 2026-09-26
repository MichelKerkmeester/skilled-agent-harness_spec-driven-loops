import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export const repository = resolve(import.meta.dirname, "..");
export const launcher = resolve(repository, "bin/supercov.js");
const localBinary = resolve(
  repository,
  "target/debug",
  `supercov${process.platform === "win32" ? ".exe" : ""}`,
);
export const localRustEnvironment = existsSync(localBinary)
  ? { SUPERCOV_RUST_BINARY: localBinary }
  : {};

export function executeSupercov(root, args, options = {}) {
  const result = spawnSync(process.execPath, [launcher, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
    ...options,
    env: {
      ...process.env,
      ...localRustEnvironment,
      ...options.env,
    },
  });
  if (result.error) throw result.error;
  return result;
}

export function requireSupercov(root, args, options = {}) {
  const result = executeSupercov(root, args, options);
  if (result.status !== 0) {
    throw new Error(
      `supercov ${args.join(" ")} failed (${result.status ?? result.signal}):\n${result.stderr}\n${result.stdout}`,
    );
  }
  return result;
}

export function runIds(root) {
  const runs = resolve(root, ".supercov/runs");
  return existsSync(runs)
    ? readdirSync(runs).sort((left, right) => {
        const leftRun = runMetadata(root, left);
        const rightRun = runMetadata(root, right);
        return leftRun.startedAt.localeCompare(rightRun.startedAt) || left.localeCompare(right);
      })
    : [];
}

export function latestRun(root) {
  const runId = runIds(root).at(-1);
  if (!runId) throw new Error(`No coverage run exists under ${root}`);
  return runId;
}

export function runMetadata(root, runId) {
  return JSON.parse(
    readFileSync(resolve(root, ".supercov/runs", runId, "run.json"), "utf8"),
  );
}

export function coverageQuery(root, runId, ...resource) {
  const result = requireSupercov(
    root,
    ["runs", runId, ...resource, "--json"],
  );
  const envelope = JSON.parse(result.stdout);
  if (envelope.schemaVersion !== 1 || envelope.ok !== true) {
    throw new Error(`Invalid coverage query response: ${result.stdout}`);
  }
  return envelope;
}
