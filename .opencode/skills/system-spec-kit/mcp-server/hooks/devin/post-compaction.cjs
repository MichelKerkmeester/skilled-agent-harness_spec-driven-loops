#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostCompaction Context Recovery
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// PostCompaction hook for Devin CLI -- a bespoke adapter, not a port. Claude's
// PreCompact fires BEFORE compaction with session_id/transcript_path/trigger and
// deliberately emits no stdout (the cache is delivered later via a synthesized
// SessionStart(source=compact)). Devin's PostCompaction fires AFTER compaction
// with only session_id and a possibly-null summary -- no transcript path, no
// trigger, no guaranteed follow-up event to defer to. The 5-step recovery chain
// below (retain summary -> rehydrate spec-folder continuity -> bounded
// memory_context(mode=resume) fallback -> provenance/length filtering -> emit
// additionalContext directly) is designed against that real constraint, not
// assumed from the Claude/Codex shape. FAILS OPEN -- any missing payload or
// internal error emits nothing and exits 0.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const { tmpdir } = require('node:os');
const { isHookEnabled } = require('../../../../../../.opencode/hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MAX_CONTEXT_BYTES = 4096;
const MEMORY_CONTEXT_TIMEOUT_MS = 2500;
const BOUNDARY_TIMEOUT_MS = 750;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emit(context) {
  if (context) {
    process.stdout.write(`${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostCompaction',
        additionalContext: context,
      },
    })}\n`);
  }
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// Step 4: bounded length + control-character stripping before any model-visible
// injection. This is deliberately conservative (not a full semantic-safety
// pipeline) -- the load-bearing guarantee is "never inject unbounded or
// control-character-laden text", not deep content classification.
function sanitizeForInjection(text) {
  if (typeof text !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  const stripped = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
  if (stripped.length === 0) return '';
  const buf = Buffer.from(stripped, 'utf8');
  return buf.length <= MAX_CONTEXT_BYTES ? stripped : `${buf.subarray(0, MAX_CONTEXT_BYTES).toString('utf8')}...`;
}

// Step 2: same lastSpecFolder state the Stop/completion-evidence hooks read,
// keyed by this session's cwd + session_id. Best-effort: any read/parse
// failure falls through silently.
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

// Step 3: bounded CLI fallback to the Spec Memory daemon's resume-mode context,
// used only when `summary` is null/empty. Never throws -- any failure (daemon
// cold, timeout, malformed JSON) returns null and the chain continues without it.
function findProjectRoot(startDir) {
  let current = startDir;
  for (let depth = 0; depth < 14; depth += 1) {
    if (existsSync(join(current, '.opencode'))) return current;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function notifyLifecycleBoundary(startDir, sessionId) {
  try {
    const projectDir = findProjectRoot(startDir);
    if (!projectDir) return false;
    const boundaryPath = join(
      projectDir,
      '.opencode',
      'skills',
      'system-spec-kit',
      'mcp-server',
      'dist',
      'hooks',
      'claude',
      'directive-lifecycle-boundary.js',
    );
    execFileSync(process.execPath, [boundaryPath], {
      cwd: projectDir,
      input: JSON.stringify({ sessionId, boundary: 'post-compact' }),
      timeout: BOUNDARY_TIMEOUT_MS,
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    return true;
  } catch (_) {
    // Context recovery remains available when advisory state cannot advance.
    return false;
  }
}

function boundedMemoryContextResume(projectDir) {
  try {
    const binPath = join(projectDir, '.opencode', 'bin', 'spec-memory.cjs');
    const raw = execFileSync(
      process.execPath,
      [
        binPath,
        'memory_context',
        '--json',
        JSON.stringify({ input: 'resume previous work after compaction', mode: 'resume' }),
        '--format',
        'json',
        '--timeout-ms',
        String(MEMORY_CONTEXT_TIMEOUT_MS),
      ],
      { cwd: projectDir, timeout: MEMORY_CONTEXT_TIMEOUT_MS + 500, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const parsed = JSON.parse(raw);
    const text = parsed?.data?.summary || parsed?.summary || parsed?.data?.context || null;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('session-lifecycle')) return emit(null);
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    notifyLifecycleBoundary(process.env.DEVIN_PROJECT_DIR || process.cwd(), null);
    return emit(null);
  }

  const sessionId = typeof payload?.session_id === 'string' ? payload.session_id : null;
  const summary = typeof payload?.summary === 'string' ? payload.summary.trim() : '';
  // Whitespace-only cwd is treated as absent so all 10 devin adapters agree.
  const workspaceCwd = payload?.cwd;
  const projectDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());
  notifyLifecycleBoundary(projectDir, sessionId);

  const sections = [];

  // Step 1: retain summary as the first recovery section, when present.
  if (summary) sections.push(`## Post-Compaction Summary\n${summary}`);

  // Step 2: rehydrate authoritative continuity from active spec-folder state.
  if (sessionId) {
    const specFolder = readLastSpecFolder(projectDir, sessionId);
    if (specFolder) sections.push(`## Active Spec Folder\n${specFolder}`);
  }

  // Step 3: bounded memory_context(mode=resume) fallback, only when summary
  // was null/empty -- this is a fallback, not a duplicate of step 1.
  if (!summary) {
    const resumeContext = boundedMemoryContextResume(projectDir);
    if (resumeContext) sections.push(`## Resume Context (fallback)\n${resumeContext}`);
  }

  if (sections.length === 0) return emit(null);

  // Step 4 + 5: sanitize the composed sections, then emit directly.
  return emit(sanitizeForInjection(sections.join('\n\n')));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => emit(null));
