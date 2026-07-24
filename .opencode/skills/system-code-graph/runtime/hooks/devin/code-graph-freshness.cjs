#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin PostToolUse Code Graph Freshness                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Queue an incremental rescan after an edit lands.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PostToolUse code-graph freshness guard for Devin CLI -- the Devin sibling of
// the Codex/Claude code-graph-freshness hook. After an edit lands, it evaluates
// the same runtime-neutral policy (debounce -> empty gate -> warm probe ->
// concurrency lock) through the shared freshness core and, only on a `scan`
// decision, fire-and-forget dispatches a detached warm-only incremental
// code_graph_scan. The primary signal is the shared append-only freshness log,
// not stdout; this hook never writes hookSpecificOutput. FAILS OPEN -- any
// missing payload or internal error exits 0 silently.
//
// STATUS: DORMANT -- see ../../../../system-spec-kit/mcp-server/hooks/devin/README.md.
// Devin's `edit` tool_name is a proposed matcher (research §10), not live-confirmed.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn } = require('node:child_process');
const { join, isAbsolute } = require('node:path');

const freshnessCore = require('../../lib/code-graph/freshness-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Devin file-write tool -- proposed name (research §10), unconfirmed live.
const DEVIN_EDIT_TOOLS = new Set(['edit']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function exitOpen() {
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function filePathFrom(toolInput, projectDir) {
  if (!toolInput || typeof toolInput !== 'object') return undefined;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  if (typeof candidate !== 'string' || !candidate) return undefined;
  return !isAbsolute(candidate) && projectDir ? join(projectDir, candidate) : candidate;
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
    try { freshnessCore.releaseScanLock({ projectDir }); } catch (_) { /* fail open */ }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (freshnessCore.isFreshnessDisabled(process.env)) return exitOpen();

  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return exitOpen(); // no/invalid payload -> fail open
  }

  if (!DEVIN_EDIT_TOOLS.has(String(payload?.tool_name || '').toLowerCase())) return exitOpen();

  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();
  const filePath = filePathFrom(payload?.tool_input, projectDir);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => exitOpen());
