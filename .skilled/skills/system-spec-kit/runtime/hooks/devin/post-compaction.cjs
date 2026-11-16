#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostCompaction Context Recovery
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// PostCompaction hook for Devin CLI -- a bespoke adapter, not a port. Claude's
// PreCompact fires BEFORE compaction and deliberately emits no stdout (the cache
// is delivered later via a synthesized SessionStart(source=compact)). Devin's
// PostCompaction fires AFTER compaction with only a session id and a possibly-null
// summary -- no transcript path, no trigger, no guaranteed follow-up event to defer
// to. The recovery chain below (retain summary -> rehydrate spec-folder continuity
// -> provenance/length filtering -> emit additionalContext directly) is designed
// against that real constraint. FAILS OPEN -- any missing payload or internal
// error emits nothing and exits 0.
'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const { tmpdir } = require('node:os');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const MAX_CONTEXT_BYTES = 4096;
const SUMMARY_HEADING = '## Post-Compaction Summary';
const BOUNDARY_TIMEOUT_MS = 750;
const SECTION_SEPARATOR = '\n\n';
const TRUNCATION_MARK = '...';
const TRUNCATION_MARK_BYTES = Buffer.byteLength(TRUNCATION_MARK, 'utf8');

function sessionLifecycleHookEnabled() {
  try {
    const { isHookEnabled } = require('../../../../../hooks/shared/hook-flags.cjs');
    return typeof isHookEnabled !== 'function' || isHookEnabled('session-lifecycle') !== false;
  } catch (_) {
    return true;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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

// The shared reader settles at a deadline, so a host that never closes stdin
// cannot hold this hook open. It is an ES module, so it loads on first use.
async function readStdin() {
  const shared = await import('../lib/hook-adapter-shared.mjs');
  return shared.readStdin();
}

// Step 4: bounded length + control-character stripping before any model-visible
// injection. This is deliberately conservative (not a full semantic-safety
// pipeline) -- the load-bearing guarantee is "never inject unbounded or
// control-character-laden text", not deep content classification.
function stripControlCharacters(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
}

function utf8Prefix(text, maxBytes) {
  if (maxBytes <= 0) return '';
  const bytes = Buffer.from(text, 'utf8');
  if (bytes.length <= maxBytes) return text;
  // A cut inside a multi-byte character decodes to U+FFFD, so drop that tail.
  return bytes.subarray(0, maxBytes).toString('utf8').replace(/�+$/u, '');
}

function cutToBudget(text, maxBytes) {
  if (Buffer.byteLength(text, 'utf8') <= maxBytes) return text;
  if (maxBytes < TRUNCATION_MARK_BYTES) return utf8Prefix(text, maxBytes);
  return `${utf8Prefix(text, maxBytes - TRUNCATION_MARK_BYTES)}${TRUNCATION_MARK}`;
}

// Step 2: same lastSpecFolder state the Stop/completion-evidence hooks read,
// keyed by this session's cwd + session id. Best-effort: any read/parse
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
      '.skilled',
      'skills',
      'system-spec-kit',
      'runtime',
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

/**
 * Join the recovery sections inside the byte budget, shortening only the summary.
 *
 * The recovery pointer comes after the summary, so cutting the joined text from
 * the end would drop the command the model must run first. This mirrors the
 * history engine's section fitter, kept here because that engine ships as a
 * build output a fresh checkout does not have, and a hook that only fits right
 * when the build exists drops the pointer everywhere else.
 *
 * @param {string[]} sections - Composed sections, the summary first when present.
 * @returns {string} The joined text, at most MAX_CONTEXT_BYTES bytes.
 */
function fitSections(sections) {
  const cleaned = sections.map((section) => stripControlCharacters(section)).filter(Boolean);
  const hasSummary = cleaned.length > 0 && cleaned[0].startsWith(SUMMARY_HEADING);
  const summary = hasSummary ? cleaned[0] : null;
  const kept = (hasSummary ? cleaned.slice(1) : cleaned).join(SECTION_SEPARATOR);
  if (summary === null) return cutToBudget(kept, MAX_CONTEXT_BYTES);

  const whole = kept ? `${summary}${SECTION_SEPARATOR}${kept}` : summary;
  if (Buffer.byteLength(whole, 'utf8') <= MAX_CONTEXT_BYTES) return whole;

  const keptBytes = kept ? Buffer.byteLength(SECTION_SEPARATOR + kept, 'utf8') : 0;
  const summaryRoom = MAX_CONTEXT_BYTES - keptBytes - TRUNCATION_MARK_BYTES;
  if (summaryRoom <= 0) return cutToBudget(whole, MAX_CONTEXT_BYTES);

  const shortened = `${utf8Prefix(summary, summaryRoom)}${TRUNCATION_MARK}`;
  return kept ? `${shortened}${SECTION_SEPARATOR}${kept}` : shortened;
}

function buildRecoveryPointer() {
  return '## Recovery\nRun `/speckit:resume` against the active packet to recover session state.';
}

function composeRecoverySections(summary, sessionId, projectDir) {
  const sections = [];

  // Step 1: retain summary as the first recovery section, when present.
  if (summary) sections.push(`${SUMMARY_HEADING}\n${summary}`);

  // Step 2: rehydrate authoritative continuity from active spec-folder state.
  if (sessionId) {
    const specFolder = readLastSpecFolder(projectDir, sessionId);
    if (specFolder) sections.push(`## Active Spec Folder\n${specFolder}`);
  }

  // Step 3: the summary and spec folder stay usable on their own.
  sections.push(buildRecoveryPointer());
  return sections;
}

// ───────────────────────────────────────────────────────────────────
// 4. MAIN
// ───────────────────────────────────────────────────────────────────

async function main() {
  if (!sessionLifecycleHookEnabled()) return emit(null);
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

  const sections = composeRecoverySections(summary, sessionId, projectDir);

  // Step 4: sanitize the composed sections, then emit directly. Only the summary
  // shortens to fit the budget, so the recovery pointer that follows it always
  // reaches the model whole.
  return emit(fitSections(sections));
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

module.exports = {
  buildRecoveryPointer,
  composeRecoverySections,
  fitSections,
};

if (require.main === module) {
  main().catch((error) => {
    // Fail-open by contract, but a swallowed failure hides a broken hook; report it.
    process.stderr.write(`post-compaction: ${error instanceof Error ? error.message : String(error)}\n`);
    emit(null);
  });
}
