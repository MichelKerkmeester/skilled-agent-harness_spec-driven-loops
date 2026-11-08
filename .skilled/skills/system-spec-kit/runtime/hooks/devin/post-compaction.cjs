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
// -> mint a locator -> provenance/length filtering -> emit additionalContext
// directly) is designed against that real constraint. FAILS OPEN -- any missing
// payload or internal error emits nothing and exits 0.
'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const { tmpdir } = require('node:os');

// The compiled helper is the one digest every adapter and the CLI share; the
// hook-state writer is the only place the CLI reads a locator from. A missing
// build disables the lookup offer rather than breaking compaction.
let locatorSupport = null;
try {
  locatorSupport = require('../../dist/hooks/lib/history/locator-digest.js');
} catch (_) {
  locatorSupport = null;
}

let hookState = null;
try {
  hookState = require('../../dist/hooks/claude/hook-state.js');
} catch (_) {
  hookState = null;
}

let lookupOffer = null;
try {
  lookupOffer = require('../../dist/hooks/lib/history/lookup-offer.js');
} catch (_) {
  lookupOffer = null;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const MAX_CONTEXT_BYTES = 4096;
const SUMMARY_HEADING = '## Post-Compaction Summary';
const BOUNDARY_TIMEOUT_MS = 750;
const HISTORY_LOCATOR_VERSION = 1;
const HISTORY_LOCATOR_KIND = 'transcript_file';
const HISTORY_LOCATOR_SOURCE = 'post_compaction';
// The marker sits beside the session's state entry and shares its key, because
// the state schema stores only its own fields and would drop an unknown one.
const PENDING_OFFER_SUFFIX = '.history-offer';

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

function sanitizeForInjection(text) {
  if (typeof text !== 'string') return '';
  const stripped = stripControlCharacters(text);
  if (stripped.length === 0) return '';
  const buf = Buffer.from(stripped, 'utf8');
  return buf.length <= MAX_CONTEXT_BYTES ? stripped : `${buf.subarray(0, MAX_CONTEXT_BYTES).toString('utf8')}...`;
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
 * Mint the opaque locator for the session this adapter was handed. The id is
 * the identity; the session store is resolved later by the runtime reader,
 * and nothing here falls back to newest-in-project discovery. The locator is
 * keyed by the checkout root above the session folder, where the printed
 * command runs, and a folder no root can serve gets no locator.
 */
function mintHistoryLocator(sessionId, workspace, mintedAt) {
  const normalizedSession = typeof sessionId === 'string' ? sessionId.trim() : '';
  const normalizedWorkspace = typeof workspace === 'string' ? workspace.trim() : '';
  if (!normalizedSession || !normalizedWorkspace) return null;
  if (/[/\\\0]/.test(normalizedSession)) return null;
  if (!locatorSupport || typeof locatorSupport.historyHandle !== 'function') return null;
  if (!lookupOffer || typeof lookupOffer.placeLookup !== 'function') return null;
  const placement = lookupOffer.placeLookup(normalizedWorkspace);
  if (!placement) return null;
  const identity = {
    runtime: 'devin',
    sessionId: normalizedSession,
    ...placement,
    locatorKind: HISTORY_LOCATOR_KIND,
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: locatorSupport.historyHandle(identity),
    mintedAt,
    provenance: { source: HISTORY_LOCATOR_SOURCE, capturedAt: mintedAt },
  };
}

/**
 * Persist the locator beside the other hook state so the printed command can
 * redeem it. Best-effort: a missing dist build or unwritable state directory
 * must never block compaction.
 */
function persistLocator(locator) {
  if (!locatorSupport || typeof locatorSupport.persistHistoryLocator !== 'function') return false;
  if (!hookState || typeof hookState.updateState !== 'function') return false;
  // The marker is written inside the same call, while the state writer is
  // scoped to the locator's checkout root, so it lands beside the locator the
  // prompt hook reads back from that root.
  return locatorSupport.persistHistoryLocator(
    locator,
    () => {
      hookState.ensureStateDir();
      const result = hookState.updateState(locator.sessionId, { historyLocator: locator });
      if (result?.persisted === true && result.merged?.historyLocator?.handle === locator.handle) {
        recordPendingOffer(locator);
      }
      return result;
    },
  );
}

/**
 * The one-shot marker the next prompt reads. Devin drops this hook's stdout, so
 * the lookup offer has to be delivered on `UserPromptSubmit` instead. A marker
 * that cannot be written only costs the offer, never the compaction.
 */
function pendingOfferPath(sessionId) {
  if (!hookState || typeof hookState.getStatePath !== 'function') return null;
  return `${hookState.getStatePath(sessionId)}${PENDING_OFFER_SUFFIX}`;
}

function recordPendingOffer(locator) {
  try {
    const markerPath = pendingOfferPath(locator.sessionId);
    if (!markerPath) return false;
    mkdirSync(dirname(markerPath), { recursive: true, mode: 0o700 });
    writeFileSync(
      markerPath,
      `${JSON.stringify({ handle: locator.handle, mintedAt: locator.mintedAt })}\n`,
      { encoding: 'utf8', mode: 0o600 },
    );
    return true;
  } catch (_) {
    return false;
  }
}

function fitSections(sections) {
  if (!lookupOffer || typeof lookupOffer.fitRecoverySections !== 'function') {
    return sanitizeForInjection(sections.join('\n\n'));
  }
  const cleaned = sections.map((section) => stripControlCharacters(section)).filter(Boolean);
  const hasSummary = cleaned.length > 0 && cleaned[0].startsWith(SUMMARY_HEADING);
  return lookupOffer.fitRecoverySections(
    hasSummary ? cleaned[0] : null,
    hasSummary ? cleaned.slice(1) : cleaned,
    MAX_CONTEXT_BYTES,
  );
}

function buildRecoveryPointer() {
  return '## Recovery\nRun `/speckit:resume` against the active packet to recover session state.';
}

// The lookup offer is not part of this output: Devin does not pass it to the
// model, so the next UserPromptSubmit delivers it from the marker instead, and
// printing it here too would show it twice on a host that did pass it.
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

  // The saved locator and its one-shot marker are what the next prompt offers.
  const locator = sessionId ? mintHistoryLocator(sessionId, projectDir, new Date().toISOString()) : null;
  if (locator) persistLocator(locator);

  const sections = composeRecoverySections(summary, sessionId, projectDir);

  // Step 4: sanitize the composed sections, then emit directly. Only the summary
  // shortens to fit the budget, so the lookup command and recovery pointer that
  // follow it always reach the model whole.
  return emit(fitSections(sections));
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

module.exports = {
  mintHistoryLocator,
  persistLocator,
  pendingOfferPath,
  recordPendingOffer,
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
