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
import { basename, resolve } from "node:path";

const root = resolve("tests/fixtures/generic-playwright");
const launcher = resolve("bin/supercov.js");
const rustBinary = resolve(
  "target/debug",
  `supercov${process.platform === "win32" ? ".exe" : ""}`,
);
const rustEnvironment = { ...process.env, SUPERCOV_RUST_BINARY: rustBinary };
const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  encoding: "utf8",
  stdio: "pipe",
});
if (build.status !== 0)
  throw new Error(`fixture build failed:\n${build.stderr}\n${build.stdout}`);

function snapshot(directory) {
  const entries = [];
  function visit(path, relativePath = "") {
    for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = resolve(path, entry.name);
      const name = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      // Supercov owns exactly one store; node_modules is linked, not copied.
      if (
        [".supercov", "node_modules"].some(
          (owned) => name === owned || name.startsWith(`${owned}/`),
        )
      )
        continue;
      if (entry.isDirectory()) visit(absolute, name);
      else if (entry.isFile()) {
        const stat = statSync(absolute);
        entries.push({
          name,
          size: stat.size,
          mtimeMs: stat.mtimeMs,
          sha256: createHash("sha256").update(readFileSync(absolute)).digest("hex"),
        });
      }
    }
  }
  visit(directory);
  return entries;
}

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === "ESRCH") return false;
    throw error;
  }
}

async function waitForProcessExit(pid, timeoutMs = 5_000) {
  const started = Date.now();
  while (processExists(pid)) {
    if (Date.now() - started >= timeoutMs)
      throw new Error(`process ${pid} survived its Supercov supervisor`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
}

async function waitForFile(path, timeoutMs = 20_000) {
  const started = Date.now();
  while (!existsSync(path)) {
    if (Date.now() - started >= timeoutMs)
      throw new Error(`timed out waiting for ${path}`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
}

async function verifyUncatchableCacheRecovery() {
  const crashRoot = mkdtempSync(resolve(tmpdir(), "supercov-crash-recovery-"));
  try {
    mkdirSync(resolve(crashRoot, "src"));
    writeFileSync(
      resolve(crashRoot, "package.json"),
      '{"name":"crash-recovery","private":true,"type":"module"}\n',
    );
    writeFileSync(
      resolve(crashRoot, "src/decision.js"),
      "export const decision = (a, b) => a && b;\n",
    );
    writeFileSync(
      resolve(crashRoot, "test.mjs"),
      'import { decision } from "./src/decision.js"; decision(true, true);\n',
    );
    const padding = resolve(crashRoot, "padding");
    mkdirSync(padding);
    for (let index = 0; index < 5_000; index += 1)
      writeFileSync(resolve(padding, `${index}.txt`), `${index}\n`);

    const projectBefore = snapshot(crashRoot);
    const expectedCache = resolve(
      crashRoot,
      ".supercov/workspaces/workspace",
      basename(crashRoot),
    );
    mkdirSync(resolve(crashRoot, ".supercov/workspaces"), { recursive: true });
    writeFileSync(
      resolve(crashRoot, ".supercov/workspaces/.supercov-workspace-store"),
      "Supercov instrumented workspace. Safe to delete.\n",
    );
    writeFileSync(resolve(crashRoot, ".supercov/workspaces/.gitignore"), "*\n");
    const cacheParent = resolve(expectedCache, "..");
    const stagingPrefix = `.${basename(crashRoot)}.staging-`;
    mkdirSync(expectedCache, { recursive: true });
    const previousGenerationMarker = resolve(
      expectedCache,
      "previous-generation.txt",
    );
    writeFileSync(previousGenerationMarker, "last complete generation\n");

    const killed = spawn(
      rustBinary,
      ["--", process.execPath, "test.mjs"],
      { cwd: crashRoot, env: rustEnvironment, stdio: ["ignore", "pipe", "pipe"] },
    );
    let killedOutput = "";
    killed.stdout.on("data", (chunk) => (killedOutput += chunk.toString()));
    killed.stderr.on("data", (chunk) => (killedOutput += chunk.toString()));
    const killedExit = new Promise((resolveExit) =>
      killed.once("exit", (code, signal) => resolveExit({ code, signal })),
    );
    await new Promise((resolveKill, reject) => {
      const timeout = setTimeout(() => {
        killed.kill("SIGKILL");
        reject(new Error(`cache preparation was not observable:\n${killedOutput}`));
      }, 20_000);
      const pollDebug = { ticks: 0, seen: [], sawLock: false };
      const transactionParents = [cacheParent, resolve(cacheParent, "..")];
      const poll = setInterval(() => {
        pollDebug.ticks += 1;
        const staging = transactionParents.some((parent) => {
          if (!existsSync(parent)) return false;
          const listed = readdirSync(parent);
          for (const entry of listed)
            if (entry.startsWith(".") && !pollDebug.seen.includes(entry) && pollDebug.seen.length < 8)
              pollDebug.seen.push(entry);
          return listed.some((entry) => entry.startsWith(stagingPrefix));
        });
        const ownsLock = existsSync(
          resolve(crashRoot, ".supercov/locks/active.json"),
        );
        pollDebug.sawLock ||= ownsLock;
        if (!staging || !ownsLock) return;
        clearInterval(poll);
        clearTimeout(timeout);
        killed.kill("SIGKILL");
        resolveKill();
      }, 2);
      killed.once("exit", (code, signal) => {
        if (signal === "SIGKILL") return;
        clearInterval(poll);
        clearTimeout(timeout);
        reject(
          new Error(
            `preparation process exited before SIGKILL (${code ?? signal}); poll=${JSON.stringify(pollDebug)}:\n${killedOutput}`,
          ),
        );
      });
      killed.once("error", reject);
    });
    const killedResult = await killedExit;
    if (killedResult.signal !== "SIGKILL")
      throw new Error(`expected SIGKILL, received ${JSON.stringify(killedResult)}`);
    if (!existsSync(previousGenerationMarker))
      throw new Error("SIGKILL replaced or removed the last complete generation");
    if (!existsSync(resolve(crashRoot, ".supercov/locks/active.json")))
      throw new Error("SIGKILL unexpectedly ran cooperative lock cleanup");

    const recovered = spawnSync(
      rustBinary,
      ["--", process.execPath, "test.mjs"],
      { cwd: crashRoot, env: rustEnvironment, encoding: "utf8", stdio: "pipe" },
    );
    if (recovered.status !== 0)
      throw new Error(
        `post-SIGKILL recovery failed:\n${recovered.stderr}\n${recovered.stdout}`,
      );
    if (existsSync(previousGenerationMarker))
      throw new Error("the recovered run did not publish a fresh cache generation");
    if (JSON.stringify(snapshot(crashRoot)) !== JSON.stringify(projectBefore))
      throw new Error("SIGKILL recovery changed a file outside the Supercov store");
  } finally {
    rmSync(crashRoot, {
      recursive: true,
      force: true,
      maxRetries: 30,
      retryDelay: 100,
    });
  }
}

async function verifyUncatchableTestTreeRecovery() {
  if (process.platform === "win32") return;
  const crashRoot = mkdtempSync(resolve(tmpdir(), "supercov-test-tree-recovery-"));
  try {
    mkdirSync(resolve(crashRoot, "src"));
    writeFileSync(
      resolve(crashRoot, "package.json"),
      '{"name":"test-tree-recovery","private":true,"type":"module"}\n',
    );
    writeFileSync(
      resolve(crashRoot, "src/decision.js"),
      "export const decision = (a, b) => a && b;\n",
    );
    const ready = resolve(crashRoot, "test-tree-ready.json");
    const escaped = resolve(crashRoot, "test-tree-escaped.txt");
    const descendantProgram = [
      "const fs=require('node:fs')",
      `setTimeout(()=>fs.writeFileSync(${JSON.stringify(escaped)},'escaped'),750)`,
      "setInterval(()=>{},1000)",
    ].join(";");
    writeFileSync(
      resolve(crashRoot, "test.mjs"),
      [
        'import { spawn } from "node:child_process";',
        'import { writeFileSync } from "node:fs";',
        'import { decision } from "./src/decision.js";',
        'if (!decision(true, true)) throw new Error("bad decision");',
        'if (process.argv[2] === "crash") {',
        `  const child = spawn(process.execPath, ["-e", ${JSON.stringify(descendantProgram)}], { stdio: "ignore" });`,
        `  writeFileSync(${JSON.stringify(ready)}, JSON.stringify({ parent: process.pid, descendant: child.pid }));`,
        "  setInterval(() => {}, 1000);",
        "}",
        "",
      ].join("\n"),
    );

    const killed = spawn(
      rustBinary,
      ["--", process.execPath, "test.mjs", "crash"],
      { cwd: crashRoot, env: rustEnvironment, stdio: ["ignore", "pipe", "pipe"] },
    );
    let output = "";
    killed.stdout.on("data", (chunk) => (output += chunk.toString()));
    killed.stderr.on("data", (chunk) => (output += chunk.toString()));
    const killedExit = new Promise((resolveExit, reject) => {
      killed.once("error", reject);
      killed.once("exit", (code, signal) => resolveExit({ code, signal }));
    });
    await waitForFile(ready);
    const tree = JSON.parse(readFileSync(ready, "utf8"));
    const workRoot = resolve(crashRoot, ".supercov/work");
    const abandonedRuns = existsSync(workRoot) ? readdirSync(workRoot) : [];
    if (abandonedRuns.length !== 1)
      throw new Error(`expected one active run before SIGKILL, found ${abandonedRuns.join(", ")}\n${output}`);
    if (!killed.kill("SIGKILL"))
      throw new Error("could not SIGKILL the active JavaScript Supercov run");
    const killedResult = await killedExit;
    if (killedResult.signal !== "SIGKILL")
      throw new Error(`expected SIGKILL, received ${JSON.stringify(killedResult)}\n${output}`);
    await Promise.all([
      waitForProcessExit(tree.parent),
      waitForProcessExit(tree.descendant),
    ]);
    await new Promise((resolveWait) => setTimeout(resolveWait, 850));
    if (existsSync(escaped))
      throw new Error("a JavaScript test descendant escaped after Supercov was SIGKILLed");

    const recovered = spawnSync(
      rustBinary,
      ["--", process.execPath, "test.mjs", "once"],
      { cwd: crashRoot, env: rustEnvironment, encoding: "utf8", stdio: "pipe" },
    );
    if (recovered.status !== 0)
      throw new Error(
        `post-SIGKILL test-tree recovery failed:\n${recovered.stderr}\n${recovered.stdout}`,
      );
    if (!recovered.stderr.includes(abandonedRuns[0]))
      throw new Error(
        `the next run did not report abandoned run ${abandonedRuns[0]}:\n${recovered.stderr}`,
      );
    if (existsSync(resolve(workRoot, abandonedRuns[0])))
      throw new Error("the next run did not remove the abandoned JavaScript transaction");
    if (existsSync(resolve(crashRoot, ".supercov/locks/active.json")))
      throw new Error("the recovered JavaScript run left the project lock behind");
  } finally {
    rmSync(crashRoot, {
      recursive: true,
      force: true,
      maxRetries: 30,
      retryDelay: 100,
    });
  }
}

await verifyUncatchableCacheRecovery();
await verifyUncatchableTestTreeRecovery();

const projectBefore = snapshot(root);
const workRoot = resolve(root, ".supercov/work");
const runsBefore = new Set(existsSync(workRoot) ? readdirSync(workRoot) : []);
const expectedCache = resolve(
  root,
  ".supercov/workspaces/workspace/generic-playwright",
);

const child = spawn(
  process.execPath,
  [launcher, "--", process.execPath, "-e", "setInterval(() => {}, 1000)"],
  { cwd: root, env: rustEnvironment, stdio: ["ignore", "pipe", "pipe"] },
);
let output = "";
let signalled = false;
const observe = (chunk) => {
  output += chunk.toString();
  if (!signalled && output.includes("[supercov] running in isolated workspace")) {
    signalled = true;
    child.kill("SIGTERM");
  }
};
child.stdout.on("data", observe);
child.stderr.on("data", observe);

const exit = await new Promise((resolveExit, reject) => {
  const timeout = setTimeout(() => {
    child.kill("SIGKILL");
    reject(new Error(`signal cleanup timed out:\n${output}`));
  }, 20_000);
  child.once("error", reject);
  child.once("exit", (code, signal) => {
    clearTimeout(timeout);
    resolveExit({ code, signal });
  });
});
if (!signalled) throw new Error(`run never entered its test phase:\n${output}`);
if (exit.code !== 143 && exit.signal !== "SIGTERM")
  throw new Error(`unexpected interrupted exit ${JSON.stringify(exit)}:\n${output}`);

const newRuns = (existsSync(workRoot) ? readdirSync(workRoot) : []).filter(
  (id) => !runsBefore.has(id),
);
if (newRuns.length !== 1)
  throw new Error(`expected one interrupted run, found ${newRuns.join(", ")}`);
const runId = newRuns[0];
const state = JSON.parse(readFileSync(resolve(workRoot, runId, "state.json"), "utf8"));
if (state.status !== "interrupted" || state.signal !== "SIGTERM")
  throw new Error(`unexpected run state: ${JSON.stringify(state)}`);
if (existsSync(resolve("/tmp/supercov-server-evidence", runId)))
  throw new Error("interrupted CLI run leaked evidence into the global temp directory");
if (state.workspace !== expectedCache || !existsSync(state.workspace))
  throw new Error(
    `interrupted run did not remain confined to the stable isolated cache: ${state.workspace}`,
  );
const interruptedMarker = resolve(state.workspace, "interrupted-marker.txt");
writeFileSync(interruptedMarker, "must be removed by the next refresh\n");
if (existsSync(resolve(root, ".supercov/locks/active.json")))
  throw new Error("project lock survived SIGTERM");
const projectAfter = snapshot(root);
if (JSON.stringify(projectAfter) !== JSON.stringify(projectBefore))
  throw new Error("a project file outside the Supercov store changed during the interrupted coverage run");

const storedRunsRoot = resolve(root, ".supercov/runs");
const storedRunsBefore = new Set(
  existsSync(storedRunsRoot) ? readdirSync(storedRunsRoot) : [],
);
// Deliberately an opaque runner rather than `test:unit`: Vitest transforms
// source in-process, so Supercov correctly skips the project's production
// build for it, and a skipped build has no instrumented artifacts to reuse.
// Build-cache reuse is only meaningful for a command that actually builds.
const successful = spawnSync(
  process.execPath,
  [launcher, "--", "npm", "run", "test:opaque"],
  { cwd: root, env: rustEnvironment, encoding: "utf8", stdio: "pipe" },
);
if (successful.status !== 0)
  throw new Error(
    `successful isolated run failed:\n${successful.stderr}\n${successful.stdout}`,
  );
if (existsSync(interruptedMarker))
  throw new Error("the next run did not refresh interrupted isolated output");
const publishedRuns = (existsSync(storedRunsRoot)
  ? readdirSync(storedRunsRoot)
  : []
).filter((id) => !storedRunsBefore.has(id));
if (publishedRuns.length !== 1)
  throw new Error(`expected one atomically published run, found ${publishedRuns.join(", ")}`);
if (existsSync(resolve("/tmp/supercov-server-evidence", publishedRuns[0])))
  throw new Error("successful CLI run leaked evidence into the global temp directory");
const publishedFiles = new Set(
  readdirSync(resolve(storedRunsRoot, publishedRuns[0])),
);
const publishedMetadata = JSON.parse(
  readFileSync(resolve(storedRunsRoot, publishedRuns[0], "run.json"), "utf8"),
);
if (publishedMetadata.instrumentedBuildCache?.reused !== true)
  throw new Error("unchanged source did not reuse the exact-fingerprint build");
if (publishedMetadata.timings?.instrumentedBuildMs > 10)
  throw new Error(
    `reused build still spent ${publishedMetadata.timings?.instrumentedBuildMs}ms in the build phase`,
  );
for (const required of [
  "evidence.raw.gz",
  "run.json",
]) {
  if (!publishedFiles.has(required))
    throw new Error(`atomically published run is missing ${required}`);
}
if (publishedFiles.has("report.json.gz"))
  throw new Error("atomically published run persisted a derived report");
if ([...publishedFiles].some((file) => file.endsWith(".html")))
  throw new Error("coverage run generated an HTML report without an explicit preview request");
if (existsSync(resolve(root, ".supercov/work", publishedRuns[0])))
  throw new Error("terminal per-run work state survived atomic publication");
if (existsSync(resolve(root, ".supercov/evidence", publishedRuns[0])))
  throw new Error("loose evidence survived atomic publication");
// The invisibility contract: after a run, the project looks exactly as the
// plain command would have left it. The wrapped command's own outputs (here
// Playwright's test-results/ and playwright-report/) are synced back by
// design; anything else changing is Supercov leaking into the project.
const commandOutput = (name) =>
  name === "test-results" ||
  name.startsWith("test-results/") ||
  name === "playwright-report" ||
  name.startsWith("playwright-report/");
const projectAfterSuccess = snapshot(root);
{
  const before = new Map(projectBefore.map((entry) => [entry.name ?? entry, JSON.stringify(entry)]));
  const after = new Map(projectAfterSuccess.map((entry) => [entry.name ?? entry, JSON.stringify(entry)]));
  const changed = [
    ...[...after.keys()].filter((name) => before.get(name) !== after.get(name)),
    ...[...before.keys()].filter((name) => !after.has(name)).map((name) => `${name} (deleted)`),
  ].filter((name) => !commandOutput(name.replace(" (deleted)", "")));
  if (changed.length > 0)
    throw new Error(
      `a file the wrapped command does not produce changed during a successful coverage run: ${changed.slice(0, 10).join(", ")}`,
    );
  const syncedOutputs = [...after.keys()].filter(
    (name) => commandOutput(name) && before.get(name) !== after.get(name),
  );
  if (syncedOutputs.length === 0)
    throw new Error(
      "the wrapped command's own outputs were not synced back to the project",
    );
}

const cleaned = spawnSync(
  process.execPath,
  [launcher, "runs", "clean", "--keep", "20"],
  { cwd: root, env: rustEnvironment, encoding: "utf8", stdio: "pipe" },
);
if (cleaned.status !== 0)
  throw new Error(`isolated cache cleanup failed:\n${cleaned.stderr}\n${cleaned.stdout}`);
if (existsSync(expectedCache))
  throw new Error("supercov runs clean left the isolated build cache behind");

console.log(
  `[isolation] SIGKILL preserved the prior cache generation, killed the complete active JavaScript test tree, and recovered both abandoned transactions; unchanged source reused its instrumented build, SIGTERM remained cooperative, clean removed all cache data, and only the wrapped command's own outputs reached the project`,
);
