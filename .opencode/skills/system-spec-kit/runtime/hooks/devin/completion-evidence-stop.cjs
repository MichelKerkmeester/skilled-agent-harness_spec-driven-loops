#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Stop Completion Evidence Sentinel
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// Stop hook for Devin CLI -- the Devin sibling of the Codex/Claude completion-
// evidence Stop sentinel. Plain, directly-runnable .cjs (no build step) that
// reads its own Stop payload, resolves the active packet from the shared
// lifecycle state file, and delegates all policy to the runtime-neutral
// completion-evidence core. NEVER emits a block/continue decision -- advisory
// only, so a bug or a false-positive claim can never force continuation. Fails
// open on any missing payload or internal error.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const sentinelCore = require('../../lib/hooks/completion-evidence-sentinel.cjs');

// Concern-generic kill-switch guard (fails open to enabled when the guard is
// missing). The legacy sentinelCore.KILL_SWITCH_ENV check below remains as an
// alias for the pre-convention operator flag.
let __isHookEnabled = () => true;
try { __isHookEnabled = require('../../../../../../.opencode/hooks/shared/hook-flags.cjs').isHookEnabled; } catch {}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> the Stop event finishes normally.
  process.exit(0);
}

function hookLog(level, msg) {
  process.stderr.write(`${level.toUpperCase()} [speckit-hook:devin-completion-evidence-stop] ${msg}\n`);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// The lifecycle prompt/stop hooks persist lastSpecFolder at
// ${tmpdir()}/speckit-claude-hooks/<sha256(cwd).slice(0,12)>/<sha256(sessionId).slice(0,16)>.json.
// The Devin lifecycle adapters delegate to those same hooks, so the file is keyed
// by this session's cwd + session_id and readable here. Best-effort: any
// read/parse failure falls through to a silent no-op below.
function readLastSpecFolder(cwd, sessionId) {
  try {
    const projectHash = createHash('sha256').update(cwd).digest('hex').slice(0, 12);
    const sessionHash = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
    const statePath = join(tmpdir(), 'speckit-claude-hooks', projectHash, `${sessionHash}.json`);
    const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
    const specFolder = parsed && typeof parsed.lastSpecFolder === 'string' ? parsed.lastSpecFolder.trim() : '';
    return specFolder || null;
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (__isHookEnabled('completion') === false) return approve();

  if (process.env[sentinelCore.KILL_SWITCH_ENV] === '1') return approve();

  try {
    sentinelCore.sweepStaleSentinelState(process.cwd(), {});
  } catch (_) {
    // Fail open.
  }

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  if (payload?.stop_hook_active === true) return approve();

  const sessionId = typeof payload?.session_id === 'string' ? payload.session_id : null;
  const claimText = typeof payload?.last_assistant_message === 'string' ? payload.last_assistant_message : '';
  if (!sessionId || !sentinelCore.detectCompletionClaim(claimText)) return approve();

  // Match the other 9 devin adapters: prefer payload cwd, then DEVIN_PROJECT_DIR,
  // then process.cwd(). A whitespace-only cwd is treated as absent.
  const workspaceCwd = payload?.cwd;
  const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());
  const specFolder = readLastSpecFolder(projectDir, sessionId);
  if (!specFolder) return approve();

  const result = sentinelCore.evaluateCompletionEvidence({
    specFolder,
    claimText,
    projectDir,
    env: process.env,
  });

  if (result.decision === 'advise' && result.detail) {
    hookLog('warn', result.detail);
    sentinelCore.appendAdvisoryLog(projectDir, result.detail);
  }

  // Advisory only -- never a block/continue decision.
  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => approve());
