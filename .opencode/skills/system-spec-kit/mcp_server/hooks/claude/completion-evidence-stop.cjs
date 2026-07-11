#!/usr/bin/env node
// Stop hook (Claude Code) for the completion-evidence sentinel.
//
// Standalone by design: the existing Stop owner (session-stop.ts, compiled to
// dist/hooks/claude/session-stop.js) is a dist-built TypeScript module, and
// this phase is barred from editing mcp_server .ts sources or rebuilding
// dist. Rather than extend that owner, this file is a second, independent
// Stop hook -- plain, directly runnable .cjs, requiring no build step -- that
// settings.json invokes alongside it under the same Stop matcher. It reads
// its OWN stdin payload (mirroring the Claude PreToolUse task-dispatch-guard
// hook's pattern), delegates all policy to the shared runtime-neutral core,
// and NEVER emits {decision:"block"} -- advisory rollout only, so a bug or a
// false-positive claim can never force continuation. Fails open on any
// missing payload or internal error.
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
  process.stderr.write(`${level.toUpperCase()} [speckit-hook:completion-evidence-stop] ${msg}\n`);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// The Claude Stop owner (session-stop.ts) persists lastSpecFolder at
// ${tmpdir()}/speckit-claude-hooks/<sha256(cwd).slice(0,12)>/<sha256(sessionId).slice(0,16)>.json
// (documented at the top of hook-state.ts). Reading that same file lets this
// standalone hook consume the packet the owner already resolved for THIS
// session, without editing the owner or its compiled dist. This is a
// best-effort read of an internal path/schema convention, not a published
// contract -- both Stop hooks fire on the same event and may run
// concurrently, so the file may be one turn stale or briefly absent; any
// read/parse failure here falls through to a silent no-op below, same as
// every other error path in this hook.
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

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  // stop_hook_active is true ONLY on a re-entrant continuation of a prior
  // Stop hook's own {decision:"block"} -- this sentinel never blocks, so it
  // has no continuation loop to guard against and must skip only that
  // re-entrant case. It is false on every normal turn-end, which is exactly
  // when this sentinel needs to fire.
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

  // Advisory only for the entire v1 rollout -- never {decision:"block"},
  // which would force Claude to continue.
  return approve();
}

main().catch(() => approve());
