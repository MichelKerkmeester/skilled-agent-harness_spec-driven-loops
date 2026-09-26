import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = mkdtempSync(resolve(tmpdir(), "supercov-watchdog-"));
const rustBinary = resolve(
  "target/debug",
  `supercov${process.platform === "win32" ? ".exe" : ""}`,
);
try {
  mkdirSync(resolve(root, "src"));
  writeFileSync(
    resolve(root, "package.json"),
    `${JSON.stringify({ name: "watchdog-fixture", type: "module" })}\n`,
  );
  writeFileSync(resolve(root, "src/index.js"), "export const value = 1;\n");
  const sourceBefore = readFileSync(resolve(root, "src/index.js"), "utf8");
  const result = spawnSync(
    process.execPath,
    [
      resolve("bin/supercov.js"),
      "--",
      process.execPath,
      "-e",
      "setInterval(() => {}, 1000)",
    ],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        SUPERCOV_RUST_BINARY: rustBinary,
        SUPERCOV_VERBOSE: "1",
        SUPERCOV_DIAGNOSTIC_INTERVAL_MS: "50",
        SUPERCOV_COMMAND_TIMEOUT_MS: "220",
      },
      timeout: 10_000,
    },
  );
  if (result.status !== 124)
    throw new Error(
      `expected timeout exit 124, received ${result.status ?? result.signal}:\n${result.stderr}`,
    );
  if (!result.stderr.includes("command still running after"))
    throw new Error(`missing periodic process diagnostic:\n${result.stderr}`);
  if (!result.stderr.includes("command exceeded SUPERCOV_COMMAND_TIMEOUT_MS=220"))
    throw new Error(`missing explicit timeout diagnostic:\n${result.stderr}`);
  if (process.platform !== "win32" && !result.stderr.includes("[supercov:active-resources]"))
    throw new Error(`missing Node active-resource report:\n${result.stderr}`);
  if (readFileSync(resolve(root, "src/index.js"), "utf8") !== sourceBefore)
    throw new Error("watchdog coverage run modified project source");
  console.log(
    "[watchdog] periodic process tree, Node active resources, explicit timeout, exit 124, unchanged source",
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}
