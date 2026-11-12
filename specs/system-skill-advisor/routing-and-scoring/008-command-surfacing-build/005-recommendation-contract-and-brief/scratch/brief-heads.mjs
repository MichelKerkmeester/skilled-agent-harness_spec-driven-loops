#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor brief head probe
// ───────────────────────────────────────────────────────────────────
// Pipes a fixed set of prompts through the real UserPromptSubmit hook and
// prints the first line of each rendered context, so the model-visible head
// can be compared before and after a renderer change without reading any
// corpus file.
// ───────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HOOK_REL = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const HOOK_TIMEOUT_MS = 30_000;
const MAX_ROOT_WALK_DEPTH = 14;

// One prompt per brief family plus one prompt outside the measured block.
// Every entry is public probe text, never a corpus row.
const PROMPTS = [
  '/speckit:plan add a login page',
  'save context for this packet before I stop for the day',
  'please improve this prompt so the worker follows it better',
  'create a readme for the utils folder',
  'turn off the comment hygiene git hook',
  'research caching strategies in depth over several iterations',
];

// ───────────────────────────────────────────────────────────────────
// 2. PATH RESOLUTION
// ───────────────────────────────────────────────────────────────────

// Anchor every path to this module's own location. The probe is launched from
// arbitrary working directories by orchestrators, so a CWD-relative path would
// find the wrong checkout or nothing at all.
const scriptDir = dirname(fileURLToPath(import.meta.url));

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

// ───────────────────────────────────────────────────────────────────
// 3. PROBE
// ───────────────────────────────────────────────────────────────────

// The hook reads one JSON object off stdin and ignores argv. Field names mirror
// what the hook source actually reads: prompt, cwd, hook_event_name, session_id.
// Each prompt gets its own session so directive dedup cannot shorten a later
// line in the same run.
function buildStdin(prompt, sessionId) {
  return JSON.stringify({
    prompt,
    cwd: repoRoot,
    hook_event_name: 'UserPromptSubmit',
    session_id: sessionId,
  });
}

for (const [index, prompt] of PROMPTS.entries()) {
  const result = spawnSync(process.execPath, [hookPath], {
    cwd: repoRoot,
    input: buildStdin(prompt, `brief-heads-probe-${index + 1}`),
    encoding: 'utf8',
    timeout: HOOK_TIMEOUT_MS,
    killSignal: 'SIGKILL',
  });
  if (result.status !== 0) {
    fail(`hook exited ${result.status} for probe ${index + 1}`);
  }
  const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
  if (!stdout) {
    fail(`hook printed no JSON for probe ${index + 1}`);
  }
  let payload;
  try {
    payload = JSON.parse(stdout);
  } catch {
    fail(`hook printed invalid JSON for probe ${index + 1}`);
  }
  const context = payload?.hookSpecificOutput?.additionalContext;
  if (typeof context !== 'string' || context.trim().length === 0) {
    fail(`hook printed no advisor context for probe ${index + 1}`);
  }
  // Only the head is compared, so a directive block that follows it stays out
  // of the one-line-per-prompt output.
  process.stdout.write(`${context.split('\n', 1)[0].trim()}\n`);
}
