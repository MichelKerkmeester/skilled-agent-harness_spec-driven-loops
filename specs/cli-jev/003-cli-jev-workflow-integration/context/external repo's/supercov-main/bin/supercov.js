#!/usr/bin/env node

import { spawn } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveNativeBinary } from "./native.js";

let rustBinary;
try {
  rustBinary = resolveNativeBinary();
} catch (error) {
  console.error(`[supercov] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
const child = spawn(
  rustBinary,
  process.argv.slice(2),
  {
    stdio: "inherit",
    env: {
      ...process.env,
      SUPERCOV_PACKAGE_ROOT: resolvePackageRoot(),
    },
  },
);

function resolvePackageRoot() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    try {
      child.kill(signal);
    } catch {
      // The child may already have completed.
    }
  });
}

child.on("error", (error) => {
  console.error("[supercov] failed to start", error);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
