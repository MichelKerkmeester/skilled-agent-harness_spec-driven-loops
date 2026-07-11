#!/usr/bin/env node
// PostToolUse(Write|Edit) code-graph freshness guard for Claude Code.
//
// Claude's counterpart to the mk-code-graph-freshness OpenCode plugin: after a
// Write/Edit lands, it evaluates the same runtime-neutral policy (debounce ->
// empty gate -> warm probe -> concurrency lock) through the shared freshness
// core and, only on a `scan` decision, fire-and-forget dispatches a detached,
// warm-only incremental code_graph_scan. Runs CO-RESIDENT with sk-code's
// claude-posttooluse.sh in the same PostToolUse Write|Edit block -- both run
// order-independently and each fails open. FAILS OPEN -- any missing payload
// or internal error exits 0 silently, so a bug here never blocks an unrelated
// edit. The primary signal is the shared append-only freshness log, not
// stdout; this hook never writes hookSpecificOutput.
'use strict';

const { spawn } = require('node:child_process');
const { join } = require('node:path');

const freshnessCore = require('../../lib/code-graph/freshness-core.cjs');

function exitOpen() {
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function dispatchScan(projectDir, dispatchSpec) {
  try {
    freshnessCore.acquireScanLock({ projectDir });
    const binPath = join(projectDir, dispatchSpec.bin);
    const child = spawn(
      process.execPath,
      [binPath, ...dispatchSpec.args],
      {
        cwd: projectDir,
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, ...(dispatchSpec.env || {}) },
      },
    );
    child.unref();
  } catch (_) {
    // Fail open: a spawn error must never affect the tool call it followed.
  } finally {
    // This process calls process.exit(0) synchronously right after main()
    // returns (exitOpen(), below) -- a child 'exit'/'error' listener registered
    // here would never fire before the process dies, so the shared lock would
    // otherwise stay held (and every other consumer see defer-inflight) for its
    // full TTL after every single dispatch. Release it synchronously in the
    // same tick instead of promising a hold this short-lived process can never
    // keep; the OpenCode plugin's long-lived listener is what actually
    // enforces hold-for-scan-duration for the shared lock.
    try { freshnessCore.releaseScanLock({ projectDir }); } catch (_) { /* fail open */ }
  }
}

async function main() {
  if (freshnessCore.isFreshnessDisabled(process.env)) return exitOpen();

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return exitOpen(); // no/invalid payload -> fail open
  }

  const toolName = String(payload?.tool_name || '');
  if (toolName !== 'Write' && toolName !== 'Edit') return exitOpen();

  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const filePath = payload?.tool_input?.file_path;
  const sessionID = payload?.session_id || '__unknown-session__';

  const result = freshnessCore.evaluateEdit({
    filePath,
    sessionID,
    projectDir,
    env: process.env,
  });

  for (const audit of result.audits || []) freshnessCore.appendFreshnessLog(projectDir, audit);
  for (const warning of result.warnings || []) freshnessCore.appendFreshnessLog(projectDir, warning);

  if (result.decision === 'scan' && result.dispatch) {
    dispatchScan(projectDir, result.dispatch);
  }

  return exitOpen();
}

main().catch(() => exitOpen());
