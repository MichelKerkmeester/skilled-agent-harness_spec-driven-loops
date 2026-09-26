#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, relative, resolve } from "node:path";

const toolRoot = resolve(".");
const rustBinary = resolve(
  toolRoot,
  `target/debug/supercov${process.platform === "win32" ? ".exe" : ""}`,
);
function launch(commandArguments, options = {}) {
  return {
    executable: rustBinary,
    arguments_: ["--", ...commandArguments],
    options: {
      ...options,
      env: {
        ...process.env,
        ...options.env,
      },
    },
  };
}

function snapshot(root) {
  const files = [];
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      const local = relative(root, path);
      const separator = process.platform === "win32" ? "\\" : "/";
      // Supercov owns the dotted store and the non-dotted workspace container.
      if (
        [".supercov"].some(
          (owned) => local === owned || local.startsWith(`${owned}${separator}`),
        )
      )
        continue;
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile())
        files.push([
          local,
          createHash("sha256").update(readFileSync(path)).digest("hex"),
        ]);
    }
  }
  visit(root);
  return files.sort(([left], [right]) => left.localeCompare(right));
}

async function waitForDeferredCleanup(root) {
  if (process.platform !== "win32") return;
  const trash = resolve(root, ".supercov/.trash");
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    let entries = [];
    try {
      entries = readdirSync(trash);
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    if (entries.length === 0) return;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  let entries = [];
  try {
    entries = readdirSync(trash);
  } catch {}
  throw new Error(
    `deferred trash cleanup did not quiesce before fixture teardown: ${entries.join(", ")}`,
  );
}

const root = mkdtempSync(resolve(tmpdir(), "supercov-fs-crash-"));
try {
  mkdirSync(resolve(root, "src"));
  writeFileSync(
    resolve(root, "package.json"),
    '{"name":"crash-recovery","private":true,"type":"module"}\n',
  );
  writeFileSync(
    resolve(root, "src/decision.js"),
    "export const decision = (a, b) => a && b;\n",
  );
  writeFileSync(
    resolve(root, "test.mjs"),
    'import { decision } from "./src/decision.js"; decision(true, true);\n',
  );
  const padding = resolve(root, "padding");
  mkdirSync(padding);
  for (let index = 0; index < 2_000; index += 1)
    writeFileSync(resolve(padding, `${index}.txt`), `${index}\n`);

  const before = snapshot(root);
  const workspace = resolve(
    root,
    ".supercov/workspaces/workspace",
    basename(root),
  );
  mkdirSync(resolve(root, ".supercov/workspaces"), { recursive: true });
  writeFileSync(
    resolve(root, ".supercov/workspaces/.supercov-workspace-store"),
    "Supercov instrumented workspace. Safe to delete.\n",
  );
  writeFileSync(resolve(root, ".supercov/workspaces/.gitignore"), "*\n");
  const cacheParent = resolve(workspace, "..");
  const stagingPrefix = `.${basename(root)}.staging-`;
  mkdirSync(workspace, { recursive: true });
  const marker = resolve(workspace, "previous-generation.txt");
  writeFileSync(marker, "last complete generation\n");

  const crashedLaunch = launch([process.execPath, "test.mjs"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const child = spawn(
    crashedLaunch.executable,
    crashedLaunch.arguments_,
    crashedLaunch.options,
  );
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk.toString()));
  child.stderr.on("data", (chunk) => (output += chunk.toString()));
  const exit = new Promise((resolveExit, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolveExit({ code, signal }));
  });
  const closed = new Promise((resolveClose, reject) => {
    child.once("error", reject);
    child.once("close", resolveClose);
  });
  await new Promise((resolveKill, reject) => {
    let observed = false;
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`cache staging was not observable:\n${output}`));
    }, 30_000);
    const poll = setInterval(() => {
      const staging = existsSync(cacheParent)
        ? readdirSync(cacheParent).some((entry) => entry.startsWith(stagingPrefix))
        : false;
      const lock = existsSync(resolve(root, ".supercov/locks/active.json"));
      if (!staging || !lock) return;
      observed = true;
      clearInterval(poll);
      clearTimeout(timeout);
      child.kill("SIGKILL");
      resolveKill();
    }, 2);
    child.once("exit", (code, signal) => {
      clearInterval(poll);
      clearTimeout(timeout);
      if (!observed)
        reject(
          new Error(
            `crash target exited before staging was observed (${code ?? signal}):\n${output}`,
          ),
        );
    });
  });
  const killed = await exit;
  // On Windows, `exit` only means the process terminated. Its inherited pipe
  // handles are released before `close`, and attempting recursive cleanup in
  // between can fail with EPERM despite the process already being gone.
  await closed;
  if (killed.code === 0)
    throw new Error(`crash target exited successfully instead of being killed:\n${output}`);
  if (!existsSync(marker))
    throw new Error("forced termination removed the last complete generation");
  if (!existsSync(resolve(root, ".supercov/locks/active.json")))
    throw new Error("forced termination unexpectedly ran cooperative cleanup");

  const recoveredLaunch = launch([process.execPath, "test.mjs"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  const recovered = spawnSync(
    recoveredLaunch.executable,
    recoveredLaunch.arguments_,
    recoveredLaunch.options,
  );
  if (recovered.status !== 0)
    throw new Error(
      `post-kill recovery failed:\n${recovered.stderr}\n${recovered.stdout}`,
    );
  if (existsSync(marker))
    throw new Error("recovery did not publish a fresh cache generation");
  if (JSON.stringify(snapshot(root)) !== JSON.stringify(before))
    throw new Error("crash recovery changed a file outside the Supercov store");

  const runs = readdirSync(resolve(root, ".supercov/runs"));
  if (runs.length !== 1)
    throw new Error(`expected one recovered published run, found ${runs}`);
  const run = resolve(root, ".supercov/runs", runs[0]);
  for (const artifact of ["evidence.raw.gz", "run.json"])
    if (!existsSync(resolve(run, artifact)))
      throw new Error(`recovered run is missing ${artifact}`);
  if (existsSync(resolve(run, "report.json.gz")))
    throw new Error("recovered run persisted a derived report");
  if (existsSync(resolve(root, ".supercov/work", runs[0])))
    throw new Error("recovered run retained terminal work state");
  if (existsSync(resolve(root, ".supercov/evidence", runs[0])))
    throw new Error("recovered run retained loose evidence");
  if (statSync(resolve(run, "evidence.raw.gz")).size === 0)
    throw new Error("recovered run published an empty evidence archive");
  console.log(
    `[filesystem] Rust crash recovery passed on ${process.platform}`,
  );
} finally {
  // The command intentionally returns before recursively unlinking its trash.
  // A Windows test fixture cannot remove the parent while that child still has
  // directory handles open, so first assert that the asynchronous lifecycle
  // operation itself completes. This is test teardown coordination, not a
  // foreground wait added to the product command.
  await waitForDeferredCleanup(root);
  rmSync(root, {
    recursive: true,
    force: true,
    maxRetries: process.platform === "win32" ? 30 : 3,
    retryDelay: process.platform === "win32" ? 100 : 20,
  });
}
