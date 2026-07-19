#!/usr/bin/env node
// Stop hook for Codex CLI -- the Codex sibling of the Claude completion-evidence
// Stop sentinel. Plain, directly-runnable .cjs (no build step) that reads its own
// Stop payload, resolves the active packet from the shared lifecycle state file,
// and delegates all policy to the runtime-neutral completion-evidence core.
// NEVER emits a block/continue decision -- advisory only, so a bug or a
// false-positive claim can never force continuation. Fails open on any missing
// payload or internal error.
//
// The claim text comes from the Stop payload's last-assistant-message. If a Codex
// version does not surface that field, detectCompletionClaim sees an empty string
// and the sentinel no-ops -- dormant-safe until Codex provides the message.
'use strict';

const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const sentinelCore = require('../../lib/hooks/completion-evidence-sentinel.cjs');

function approve() {
  // No output + exit 0 -> the Stop event finishes normally.
  process.exit(0);
}

function hookLog(level, msg) {
  process.stderr.write(`${level.toUpperCase()} [speckit-hook:codex-completion-evidence-stop] ${msg}\n`);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// The lifecycle prompt/stop hooks persist lastSpecFolder at
// ${tmpdir()}/speckit-claude-hooks/<sha256(cwd).slice(0,12)>/<sha256(sessionId).slice(0,16)>.json.
// The Codex lifecycle adapters delegate to those same hooks, so the file is keyed
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

async function main() {
  if (process.env[sentinelCore.KILL_SWITCH_ENV] === '1') return approve();

  // Best-effort, throttled state sweep. This hook is a short-lived process
  // spawned fresh per Stop event; the core's own on-disk sweep lock is what
  // throttles the sweep across repeated Stop events. A sweep error must never
  // affect Stop processing below.
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

  // stop_hook_active is true ONLY on a re-entrant continuation of a prior Stop
  // hook's own block -- this sentinel never blocks, so it skips only that
  // re-entrant case and fires on every normal turn-end.
  if (payload?.stop_hook_active === true) return approve();

  const sessionId = typeof payload?.session_id === 'string' ? payload.session_id : null;
  const claimText = typeof payload?.last_assistant_message === 'string' ? payload.last_assistant_message : '';
  if (!sessionId || !sentinelCore.detectCompletionClaim(claimText)) return approve();

  const projectDir = process.cwd();
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

main().catch(() => approve());
