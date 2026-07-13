#!/usr/bin/env node
// PostToolUse code-graph freshness guard for Codex CLI -- the Codex sibling of
// the Claude code-graph-freshness hook. After an apply_patch/edit lands, it
// evaluates the same runtime-neutral policy (debounce -> empty gate -> warm probe
// -> concurrency lock) through the shared freshness core and, only on a `scan`
// decision, fire-and-forget dispatches a detached warm-only incremental
// code_graph_scan. The primary signal is the shared append-only freshness log,
// not stdout; this hook never writes hookSpecificOutput. FAILS OPEN -- any
// missing payload or internal error exits 0 silently.
'use strict';

const { spawn } = require('node:child_process');
const { join, isAbsolute } = require('node:path');

const freshnessCore = require('../../lib/code-graph/freshness-core.cjs');

// Codex file-write tools -- this guard only cares that a file changed.
const CODEX_EDIT_TOOLS = new Set(['apply_patch', 'edit']);

function exitOpen() {
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// Codex `apply_patch` carries the target inside the patch body (tool_input.command)
// as an `*** Add/Update/Delete File:` header, not a file_path field. Parse it out
// so a Codex patch actually triggers the freshness probe.
function firstPatchPath(patchText) {
  if (typeof patchText !== 'string') return undefined;
  const match = patchText.match(/^\*\*\* (?:Add|Update|Delete) File: (.+?)\s*$/m)
    || patchText.match(/^\*\*\* Move to: (.+?)\s*$/m);
  return match ? match[1].trim() : undefined;
}

function filePathFrom(toolInput, projectDir) {
  if (!toolInput || typeof toolInput !== 'object') return undefined;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  let resolved = typeof candidate === 'string' && candidate ? candidate : firstPatchPath(toolInput.command || toolInput.input || toolInput.patch);
  if (!resolved) return undefined;
  // A patch-derived path is relative to the project dir; make it absolute so the
  // core's file-type and change checks resolve against the real file.
  if (!isAbsolute(resolved) && projectDir) resolved = join(projectDir, resolved);
  return resolved;
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
    // This process exits synchronously right after main() returns, so a child
    // 'exit'/'error' listener would never fire in time to release the shared
    // lock. Release it in the same tick instead; the OpenCode plugin's
    // long-lived listener is what enforces hold-for-scan-duration.
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

  if (!CODEX_EDIT_TOOLS.has(String(payload?.tool_name || '').toLowerCase())) return exitOpen();

  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
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

main().catch(() => exitOpen());
