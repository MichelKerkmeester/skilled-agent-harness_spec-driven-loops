#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Workflow Step Programs
// ───────────────────────────────────────────────────────────────────
//
// The research and review workflows once carried these programs inline as
// `node -e` bodies, and every runtime that executes a workflow had to
// transcribe them from the YAML, which is where runs varied most across
// runtimes. Each subcommand is one of those programs, moved unchanged, so the
// workflow step makes one plain call and the output, exit code and files it
// writes stay what they were. A body that reads `process.argv` reads it in the
// `node -e` shape, with the step's arguments from index 1, so the dispatcher
// rewrites `process.argv` to that shape before it calls the body.

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. STEP PROGRAMS
// ───────────────────────────────────────────────────────────────────

// Reads the session id, generation and state-log tail digest of a packet that
// is about to be archived. Shared by both workflows' restart paths.
//
// A packet can lack its root config: an older fan-out root never wrote one. The
// chain is then rebuilt from what the packet does hold, in this order:
//   1. the lineage configs beside it (lineages/*/<config name>). Each fan-out
//      lineage names the root session as its parent and runs in the root's
//      generation, so one shared parent is the prior session and the highest
//      lineage generation is its generation. Disagreeing parents name no session.
//   2. the state log's session ids, less the packet folder name, which older runs
//      wrote as a placeholder. Exactly one remaining id is the prior session; its
//      generation is the highest one its rows carry, else 1, since it ran once.
// Anything else reports no prior session, as before.
function priorLineageFallback(fs, path, configPath, stateLogPath) {
  const packetDir = path.dirname(configPath);
  const readJson = (file) => {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; }
  };
  const lineageOf = (config) => (config && typeof config === "object" ? (config.lineage || config) : null);
  const parents = new Set();
  let lineageGeneration = 0;
  let entries = [];
  try { entries = fs.readdirSync(path.join(packetDir, "lineages"), { withFileTypes: true }); } catch { entries = []; }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const lineage = lineageOf(readJson(path.join(packetDir, "lineages", entry.name, path.basename(configPath))));
    if (!lineage || typeof lineage.parentSessionId !== "string" || lineage.parentSessionId.trim() === "") continue;
    parents.add(lineage.parentSessionId);
    if (Number.isInteger(lineage.generation)) lineageGeneration = Math.max(lineageGeneration, lineage.generation);
  }
  if (parents.size === 1) return { sessionId: [...parents][0], generation: Math.max(1, lineageGeneration) };
  if (parents.size > 1) return null;

  let lines = [];
  try { lines = fs.readFileSync(stateLogPath, "utf8").split("\n"); } catch { lines = []; }
  const placeholder = path.basename(packetDir);
  const generations = new Map();
  for (const line of lines) {
    let row;
    try { row = JSON.parse(line); } catch { continue; }
    if (!row || typeof row.sessionId !== "string" || row.sessionId.trim() === "" || row.sessionId === placeholder) continue;
    const seen = generations.get(row.sessionId) || 0;
    generations.set(row.sessionId, Number.isInteger(row.generation) ? Math.max(seen, row.generation) : seen);
  }
  if (generations.size !== 1) return null;
  const [[sessionId, generation]] = [...generations];
  return { sessionId, generation: Math.max(1, generation) };
}

function priorLineage() {
  const fs = require("fs");
  const path = require("path");
  const crypto = require("crypto");
  let priorSessionId = null;
  let priorGeneration = 0;
  try {
    const config = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const lineage = config.lineage || config;
    priorSessionId = typeof lineage.sessionId === "string" ? lineage.sessionId : null;
    priorGeneration = Number(lineage.generation) || 0;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("The old config cannot be read: " + error.message);
      process.exit(1);
    }
    const fallback = priorLineageFallback(fs, path, process.argv[1], process.argv[2]);
    if (fallback) {
      priorSessionId = fallback.sessionId;
      priorGeneration = fallback.generation;
    }
  }
  let priorTailDigest = crypto.createHash("sha256").update("").digest("hex");
  try {
    priorTailDigest = crypto.createHash("sha256").update(fs.readFileSync(process.argv[2])).digest("hex");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  console.log(JSON.stringify({ priorSessionId, priorGeneration, priorTailDigest }));
}

// Reopens a completed research run: stages the run_extended event and the next
// config in the work directory and prints the new budget.
function extendResearch() {
  const fs = require("fs"), crypto = require("crypto"), path = require("path");
  const [configPath, stateLogPath, inboxPath, extendRaw, extendMinutesRaw, workDir] = process.argv.slice(1);
  const fail = (message) => { console.error(message); process.exit(2); };
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  // The preflight check refuses these first; this keeps a bad value from reaching the config.
  if (!/^[1-9][0-9]*$/.test(String(extendRaw))) {
    fail("--extend needs a positive integer, and got " + JSON.stringify(String(extendRaw)) + ".");
  }
  const minutesRaw = String(extendMinutesRaw);
  if (minutesRaw !== "" && !minutesRaw.startsWith("{") && !/^[1-9][0-9]*$/.test(minutesRaw)) {
    fail("--extend-minutes needs a positive integer, and got " + JSON.stringify(minutesRaw) + ".");
  }
  if (config.status !== "complete") {
    fail("--extend needs a completed run, and this run has status " + config.status + ". Use --lineage-mode=resume to continue an unfinished run.");
  }
  const stateBytes = fs.readFileSync(stateLogPath);
  const rows = stateBytes.toString("utf8").split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  // One run per iteration number, error and timeout rows included. The integer
  // iteration counts first and a numeric run is the fallback, as the state reader
  // counts them, because a leaf may write its run id string in run.
  const continuedFromRun = new Set(rows
    .filter((row) => row && row.type === "iteration")
    .map((row) => (Number.isInteger(row.iteration) ? row.iteration : Number(row.run)))
    .filter((run) => Number.isInteger(run))).size;
  const addedIterations = Number(extendRaw);
  const priorMaxIterations = Number(config.maxIterations) || 0;
  const priorMaxDurationMinutes = Number(config.maxDurationMinutes) || 0;
  const createdMs = Date.parse(config.createdAt);
  const elapsedMinutesAtExtension = Number.isFinite(createdMs)
    ? Math.max(0, Math.floor((Date.now() - createdMs) / 60000))
    : 0;
  // An unset flag renders as an empty or unexpanded value, never as digits.
  const hasMinutes = /^[1-9][0-9]*$/.test(String(extendMinutesRaw));
  const addedMinutes = hasMinutes ? Number(extendMinutesRaw) : priorMaxDurationMinutes;
  // A run with no duration budget keeps none unless --extend-minutes asks for one.
  const newMaxDurationMinutes = priorMaxDurationMinutes > 0 || hasMinutes
    ? Math.max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + addedMinutes
    : priorMaxDurationMinutes;
  const newMaxIterations = continuedFromRun + addedIterations;
  const lineage = config.lineage || {};
  const sessionId = lineage.sessionId;
  const lineageId = lineage.parentSessionId || sessionId;
  const generation = Number(lineage.generation) || 1;
  const event = {
    stem: "deep_research.run_extended",
    scope: { runId: sessionId, lineageId },
    data: {
      priorTailDigest: crypto.createHash("sha256").update(stateBytes).digest("hex"),
      sessionId,
      generation,
      continuedFromRun,
      extension: {
        addedIterations,
        priorMaxIterations,
        newMaxIterations,
        priorMaxDurationMinutes,
        newMaxDurationMinutes,
        elapsedMinutesAtExtension,
      },
    },
  };
  const next = {
    ...config,
    status: "initialized",
    maxIterations: newMaxIterations,
    maxDurationMinutes: newMaxDurationMinutes,
    lineage: { ...lineage, lineageMode: "completed-continue", continuedFromRun },
  };
  fs.writeFileSync(path.join(workDir, "event.json"), JSON.stringify(event));
  fs.writeFileSync(path.join(workDir, "config.json"), JSON.stringify(next, null, 2) + "\n");
  let pendingInbox = 0;
  try {
    pendingInbox = fs.readFileSync(inboxPath, "utf8").split("\n").filter((line) => line.trim() !== "").length;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  // Config creation writes the stop policy at the top level, beside maxIterations.
  const stopPolicy = config.stopPolicy || "convergence";
  // With convergence mode off the stop decision continues before it forms any
  // candidate, so the run cannot re-stop on all_questions_answered.
  const convergenceOff = (config.antiConvergence && config.antiConvergence.convergenceMode) === "off";
  const warning = stopPolicy === "convergence" && !convergenceOff && pendingInbox === 0
    ? "This run stops on convergence and has no pending inbox question, so it may re-stop on all_questions_answered right away. An extension keeps the stop policy and convergence mode it was created with, and a flag passed beside --extend does not change them. Add questions to research/inbox.jsonl before you extend to keep it running."
    : null;
  console.log(JSON.stringify({ continuedFromRun, newMaxIterations, newMaxDurationMinutes, warning }));
}

// Reopens a completed review run, the review twin of extendResearch.
function extendReview() {
  const fs = require("fs"), crypto = require("crypto"), path = require("path");
  const [configPath, stateLogPath, extendRaw, extendMinutesRaw, workDir] = process.argv.slice(1);
  const fail = (message) => { console.error(message); process.exit(2); };
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  // The preflight check refuses these first; this keeps a bad value from reaching the config.
  if (!/^[1-9][0-9]*$/.test(String(extendRaw))) {
    fail("--extend needs a positive integer, and got " + JSON.stringify(String(extendRaw)) + ".");
  }
  const minutesRaw = String(extendMinutesRaw);
  if (minutesRaw !== "" && !minutesRaw.startsWith("{") && !/^[1-9][0-9]*$/.test(minutesRaw)) {
    fail("--extend-minutes needs a positive integer, and got " + JSON.stringify(minutesRaw) + ".");
  }
  if (config.status !== "complete") {
    fail("--extend needs a completed run, and this run has status " + config.status + ". Use --lineage-mode=resume to continue an unfinished run.");
  }
  const stateBytes = fs.readFileSync(stateLogPath);
  const rows = stateBytes.toString("utf8").split("\n").filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  // One run per iteration number, error and timeout rows included. The integer
  // iteration counts first and a numeric run is the fallback, as the state reader
  // counts them, because a leaf may write its run id string in run.
  const continuedFromRun = new Set(rows
    .filter((row) => row && row.type === "iteration")
    .map((row) => (Number.isInteger(row.iteration) ? row.iteration : Number(row.run)))
    .filter((run) => Number.isInteger(run))).size;
  const addedIterations = Number(extendRaw);
  const priorMaxIterations = Number(config.maxIterations) || 0;
  const priorMaxDurationMinutes = Number(config.maxDurationMinutes) || 0;
  const createdMs = Date.parse(config.createdAt);
  const elapsedMinutesAtExtension = Number.isFinite(createdMs)
    ? Math.max(0, Math.floor((Date.now() - createdMs) / 60000))
    : 0;
  // An unset flag renders as an empty or unexpanded value, never as digits.
  const hasMinutes = /^[1-9][0-9]*$/.test(String(extendMinutesRaw));
  const addedMinutes = hasMinutes ? Number(extendMinutesRaw) : priorMaxDurationMinutes;
  // A run with no duration budget keeps none unless --extend-minutes asks for one.
  const newMaxDurationMinutes = priorMaxDurationMinutes > 0 || hasMinutes
    ? Math.max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + addedMinutes
    : priorMaxDurationMinutes;
  const newMaxIterations = continuedFromRun + addedIterations;
  const sessionId = config.sessionId;
  const generation = Number(config.generation) || 1;
  const event = {
    stem: "deep_review.run_extended",
    scope: { runId: sessionId, sessionId, generation },
    data: {
      priorTailDigest: crypto.createHash("sha256").update(stateBytes).digest("hex"),
      continuedFromRun,
      extension: {
        addedIterations,
        priorMaxIterations,
        newMaxIterations,
        priorMaxDurationMinutes,
        newMaxDurationMinutes,
        elapsedMinutesAtExtension,
      },
    },
  };
  const next = {
    ...config,
    status: "initialized",
    maxIterations: newMaxIterations,
    maxDurationMinutes: newMaxDurationMinutes,
    lineageMode: "completed-continue",
    continuedFromRun,
  };
  fs.writeFileSync(path.join(workDir, "event.json"), JSON.stringify(event));
  fs.writeFileSync(path.join(workDir, "config.json"), JSON.stringify(next, null, 2) + "\n");
  // Config creation writes the stop policy at the top level, beside maxIterations.
  const stopPolicy = config.stopPolicy || "convergence";
  // Review has no question inbox, so under convergence an unchanged dimension set
  // can re-stop on all_dimensions_clean before the new budget is used. The
  // extension keeps the stop policy and convergence mode the config already holds.
  // With convergence mode off the stop decision continues before it forms any
  // candidate, so the run cannot re-stop on all_dimensions_clean.
  // An expansive run whose frontier drained re-stops on frontier_drained the same way.
  const convergenceOff = (config.antiConvergence && config.antiConvergence.convergenceMode) === "off";
  const restopReasons = (config.antiConvergence && config.antiConvergence.depthMode) === "expansive"
    ? "all_dimensions_clean or frontier_drained"
    : "all_dimensions_clean";
  const warning = stopPolicy === "convergence" && !convergenceOff
    ? "This run stops on convergence, so it may re-stop on " + restopReasons + " right away. An extension keeps the stop policy and convergence mode it was created with, and a flag passed beside --extend does not change them, so only a run created with --convergence-mode=off is sure to use the new budget."
    : null;
  console.log(JSON.stringify({ continuedFromRun, newMaxIterations, newMaxDurationMinutes, warning }));
}

// Prints the config's lineage generation, 1 when it carries none.
function generation() {
  const c = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  console.log(Number((c.lineage || c).generation) || 1);
}

// Prints the deep_research.run_initialized event for the config.
function runOpenResearch() {
  const fs = require("fs"), crypto = require("crypto");
  const [configPath] = process.argv.slice(1);
  const raw = fs.readFileSync(configPath);
  const config = JSON.parse(raw);
  const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
  const lineage = config.lineage || {};
  const sessionId = lineage.sessionId;
  const lineageId = lineage.parentSessionId || sessionId;
  const generation = Number(lineage.generation) || 1;
  const configDigest = sha(raw);
  // The projected config row shows this topic; one the schema cannot hold is left out,
  // and the row falls back to the run id rather than the run failing to open.
  const topic = typeof config.topic === "string" && config.topic.trim() !== "" && config.topic.length <= 4096
    ? config.topic
    : null;
  const event = {
    stem: "deep_research.run_initialized",
    scope: { runId: sessionId, lineageId },
    data: {
      generation,
      ...(topic === null ? {} : { topic }),
      charterDigest: sha(Buffer.from(JSON.stringify({
        topic: config.topic,
        specFolder: config.specFolder || "",
      }))),
      configDigest,
      executorFingerprint: sha(Buffer.from(JSON.stringify(config.executor || {}))),
      replayFingerprint: sha(Buffer.from(JSON.stringify({
        runId: sessionId,
        lineageId,
        generation,
        configDigest,
      }))),
      maxIterations: Number(config.maxIterations),
      convergencePolicyVersion: "convergence-policy@" + (
        (config.antiConvergence && config.antiConvergence.convergenceMode) || "default"
      ),
    },
  };
  process.stdout.write(JSON.stringify(event));
}

// Prints the deep_review.run_initialized event for the config. The contract digest
// covers the workflow file named by the second argument and this file, since the
// step programs the workflow once ran inline now live here.
function runOpenReview() {
  const fs = require("fs"), crypto = require("crypto");
  const [configPath, workflowPath] = process.argv.slice(1);
  const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
  const raw = fs.readFileSync(configPath);
  const config = JSON.parse(raw);
  const targetTypes = { files: "file", file: "file", directory: "directory", "spec-folder": "directory", track: "directory", repository: "repository" };
  const lineageModes = { new: "fresh", fresh: "fresh", restart: "restart", resume: "resume" };
  // The projected config row shows this topic; one the schema cannot hold is left out,
  // and the row falls back to the run id rather than the run failing to open.
  const topic = typeof config.topic === "string" && config.topic.trim() !== "" && config.topic.length <= 4096
    ? config.topic
    : null;
  process.stdout.write(JSON.stringify({
    stem: "deep_review.run_initialized",
    scope: { runId: config.sessionId, sessionId: config.sessionId, generation: Number(config.generation) || 1 },
    data: {
      target: {
        targetId: "review-target",
        targetType: targetTypes[config.reviewTargetType] || "artifact",
        artifactRef: "deep-review-config.json#reviewTarget",
        sourceDigest: sha(String(config.reviewTarget)),
        contentDigest: sha(raw),
      },
      lineageMode: lineageModes[config.lineageMode] || "fresh",
      maxIterations: Number(config.maxIterations),
      convergencePolicyVersion: "convergence-policy@" + ((config.antiConvergence && config.antiConvergence.convergenceMode) || "default"),
      reviewModeContractDigest: sha(Buffer.concat([fs.readFileSync(workflowPath), fs.readFileSync(__filename)])),
      initialReleaseReadinessState: "not-assessed",
      ...(topic === null ? {} : { topic }),
    },
  }));
}

// Reports whether the run has used its wall-clock budget. Shared by both workflows.
function maxDuration() {
  const config = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const maxDurationMinutes = Number(config.maxDurationMinutes);
  const startedMs = Date.parse(config.createdAt);
  const elapsedMinutes = Math.floor((Date.now() - startedMs) / 60000);
  const reached = Number.isFinite(maxDurationMinutes) && maxDurationMinutes > 0
    && Number.isFinite(startedMs) && elapsedMinutes >= maxDurationMinutes;
  console.log(JSON.stringify({ elapsedMinutes, maxDurationMinutes, reached }));
}

// Replays the iteration rows of a set-aside hand-written review state log
// through the append gateway and reports how many it carried.
function replayLegacyReview() {
  const fs = require("fs"), os = require("os"), path = require("path");
  const { spawnSync } = require("child_process");
  const [gateway, legacyLog, runDir] = process.argv.slice(1);
  let replayedIterations = 0;
  let keptOnlyInLegacyLog = 0;
  for (const line of fs.readFileSync(legacyLog, "utf8").split("\n")) {
    if (line.trim() === "") continue;
    let row;
    try { row = JSON.parse(line); } catch { keptOnlyInLegacyLog += 1; continue; }
    // The run open already replaced the config row.
    if (row && row.type === "config") continue;
    if (!row || row.type !== "iteration") { keptOnlyInLegacyLog += 1; continue; }
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "deep-review-replay-"));
    const eventFile = path.join(tempDir, "row.json");
    fs.writeFileSync(eventFile, JSON.stringify(row));
    const result = spawnSync(process.execPath, [gateway, "--mode", "review", "--run-directory", runDir, "--event-json", eventFile], { encoding: "utf8" });
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (result.status === 2) { process.stdout.write(result.stdout || ""); process.exit(2); }
    if (result.status === 0) replayedIterations += 1; else keptOnlyInLegacyLog += 1;
  }
  process.stdout.write(JSON.stringify({ replayedIterations, keptOnlyInLegacyLog, legacyLog }) + "\n");
}

// cli-mistral-vibe has no single-executor path, so the step refuses it before
// any dispatch receipt is written.
function refuseSingleVibe() {
  console.error('cli-mistral-vibe runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind');
  process.exit(2);
}

// ───────────────────────────────────────────────────────────────────
// 2. DISPATCH
// ───────────────────────────────────────────────────────────────────

const SUBCOMMANDS = Object.freeze({
  'prior-lineage': priorLineage,
  'extend-research': extendResearch,
  'extend-review': extendReview,
  generation,
  'run-open-research': runOpenResearch,
  'run-open-review': runOpenReview,
  'max-duration': maxDuration,
  'replay-legacy-review': replayLegacyReview,
  'refuse-single-vibe': refuseSingleVibe,
});

function main() {
  const [execPath, , subcommand, ...args] = process.argv;
  const program = Object.prototype.hasOwnProperty.call(SUBCOMMANDS, subcommand) ? SUBCOMMANDS[subcommand] : null;
  if (!program) {
    console.error('Usage: workflow-steps.cjs <' + Object.keys(SUBCOMMANDS).join('|') + '> [args...]');
    process.exit(2);
  }
  process.argv = [execPath, ...args];
  program();
}

if (require.main === module) {
  main();
}

module.exports = { SUBCOMMANDS };
