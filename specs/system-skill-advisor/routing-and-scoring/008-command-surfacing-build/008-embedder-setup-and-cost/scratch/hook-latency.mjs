#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude prompt-hook latency probe
// ───────────────────────────────────────────────────────────────────
// Times the real UserPromptSubmit hook once per prompt and reports the
// distribution on stdout. The hook self-limits to a few seconds per call,
// so the probe runs strictly sequentially: parallel runs would contend for
// the same advisor daemon and the same diagnostic store and would measure
// queueing rather than per-prompt cost.
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HOOK_REL = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
// The hook emits diagnostics on stderr that dwarf the prompt; keep the cap
// generous enough that a verbose run cannot be reported as OUTPUT_OVERFLOW.
const MAX_STDIO_BYTES = 16 * 1024 * 1024;
const HOOK_TIMEOUT_MS = 30_000;
const MAX_ROOT_WALK_DEPTH = 14;

// ───────────────────────────────────────────────────────────────────
// 2. PATH RESOLUTION
// ───────────────────────────────────────────────────────────────────

// Anchor every path to this module's own location. The probe is launched from
// arbitrary working directories by orchestrators, so a CWD-relative path would
// find the wrong checkout or nothing at all.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const rowsPath = join(scriptDir, 'tune-rows.jsonl');

function findRepoRoot() {
  let current = scriptDir;
  for (let depth = 0; depth < MAX_ROOT_WALK_DEPTH; depth += 1) {
    if (existsSync(join(current, HOOK_REL))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

const repoRoot = findRepoRoot();
if (!repoRoot) {
  fail(`hook file not found: walked up from ${scriptDir} for ${HOOK_REL}`);
}
const hookPath = resolve(repoRoot, HOOK_REL);
if (!existsSync(hookPath)) {
  fail(`hook file missing: ${hookPath}`);
}
if (!existsSync(rowsPath)) {
  fail(`rows file missing: ${rowsPath}`);
}

// ───────────────────────────────────────────────────────────────────
// 3. ROW LOADING
// ───────────────────────────────────────────────────────────────────

// Blank lines and non-object records are skipped rather than thrown: the prompt
// corpus is hand-maintained and one malformed row must not void a full run.
function loadPrompts(path) {
  const prompts = [];
  const lines = readFileSync(path, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed.prompt === 'string') {
        prompts.push(parsed.prompt);
      }
    } catch {
      // Unparseable row: skip.
    }
  }
  return prompts;
}

// ───────────────────────────────────────────────────────────────────
// 4. MEASUREMENT
// ───────────────────────────────────────────────────────────────────

// The hook reads one JSON object off stdin and ignores argv. Field names mirror
// what the hook source actually reads: prompt, cwd, hook_event_name, session_id.
function buildStdin(prompt) {
  return JSON.stringify({
    prompt,
    cwd: repoRoot,
    hook_event_name: 'UserPromptSubmit',
    session_id: 'latency-probe',
  });
}

const prompts = loadPrompts(rowsPath);
const durations = [];
let nonZeroExits = 0;
let emptyOutputs = 0;

for (const prompt of prompts) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [hookPath], {
    cwd: repoRoot,
    input: buildStdin(prompt),
    encoding: 'utf8',
    timeout: HOOK_TIMEOUT_MS,
    maxBuffer: MAX_STDIO_BYTES,
    killSignal: 'SIGKILL',
  });
  durations.push(performance.now() - startedAt);

  // A null status means the process was killed, timed out or never spawned;
  // that is not a clean exit either, so it counts alongside a non-zero code.
  if (result.status !== 0) {
    nonZeroExits += 1;
  }
  const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
  if (!stdout) {
    emptyOutputs += 1;
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. SUMMARY
// ───────────────────────────────────────────────────────────────────

function round(value) {
  return Math.round(value * 100) / 100;
}

function median(sorted) {
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[midpoint]
    : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
}

// Nearest-rank percentile: the smallest value at or above the requested rank.
// With small sample counts an interpolated percentile would report a duration
// that was never actually observed.
function percentile(sorted, fraction) {
  const rank = Math.ceil(fraction * sorted.length) - 1;
  return sorted[Math.min(Math.max(rank, 0), sorted.length - 1)];
}

const sorted = [...durations].sort((left, right) => left - right);
const summary = {
  n: durations.length,
  medianMs: sorted.length ? round(median(sorted)) : 0,
  p95Ms: sorted.length ? round(percentile(sorted, 0.95)) : 0,
  minMs: sorted.length ? round(sorted[0]) : 0,
  maxMs: sorted.length ? round(sorted[sorted.length - 1]) : 0,
  nonZeroExits,
  emptyOutputs,
};

process.stdout.write(`${JSON.stringify(summary)}\n`);
