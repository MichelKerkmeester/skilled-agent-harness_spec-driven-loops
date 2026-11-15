#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Compaction Context Detector
// ───────────────────────────────────────────────────────────────────
// Vibe has no compaction hook, and session_start does not run again after an
// automatic compaction, so the bound packet's goal slice, the history lookup
// offer and the open handoff pointer are gone for the rest of the run. The
// journal records every compaction, so this detector compares those entries
// with a per-session watermark and rebuilds that context once per compaction.
// The turn-start composer runs it at the next operator message; the post_tool
// binding runs it at the next tool call when a long headless turn compacted
// mid-turn. Every path fails open: a missing journal, an unreadable watermark
// or a malformed entry yields no text and never throws.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderVibeGoalSlice } from '../../goal/vibe/goal-inject.mjs';
import { capabilities } from '../../shared/session-readers/index.mjs';
import { compactionsSince, loadVibeSession } from '../../shared/session-readers/vibe.mjs';

const require = createRequire(import.meta.url);
const { claimCommandFor, openNotePathFor, resolveRepoRoot } = require('../../in-session-handover/lib/nudge.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A Vibe session runs in a throwaway folder, so the checkout is located from
// this file instead: vibe -> session-lifecycle -> hooks -> .skilled -> root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const STATE_RELATIVE_DIR = '.skilled/skills/.state/vibe-compaction';
const MAX_STATE_BYTES = 4096;

const HISTORY_LOCATOR_VERSION = 1;
const HISTORY_LOCATOR_KIND = 'transcript_path';
const HISTORY_LOCATOR_SOURCE = 'post_compaction';
const COMPACTION_HEADING = 'Context restored after a compaction.';

// The compiled helpers are the one digest, state writer and offer builder every
// runtime and the CLI share. A missing build disables the offer rather than
// failing the detector, which still re-injects the goal slice.
let historySupport = null;
try {
  const [digest, state, offer] = await Promise.all([
    import('../../../skills/system-spec-kit/runtime/dist/hooks/lib/history/locator-digest.js'),
    import('../../../skills/system-spec-kit/runtime/dist/hooks/claude/hook-state.js'),
    import('../../../skills/system-spec-kit/runtime/dist/hooks/lib/history/lookup-offer.js'),
  ]);
  if (typeof digest.historyHandle === 'function'
    && typeof digest.persistHistoryLocator === 'function'
    && typeof state.updateState === 'function'
    && typeof state.ensureStateDir === 'function'
    && typeof offer.buildHistoryLookupSection === 'function'
    && typeof offer.placeLookup === 'function') {
    historySupport = { digest, state, offer };
  }
} catch {
  historySupport = null;
}

// The directive store is what keeps the constant advisor block from repeating.
// Advancing this session's epoch is the compaction boundary the other runtimes
// get from their host, so the next advisor brief carries the block again.
let directiveSupport = null;
try {
  const module = await import(
    '../../../skills/system-skill-advisor/runtime/dist/hooks/lib/directive-lifecycle.js'
  );
  if (typeof module.advanceDirectiveLifecycleBoundary === 'function'
    && typeof module.defaultDirectiveLifecycleStore === 'function') {
    directiveSupport = module;
  }
} catch {
  directiveSupport = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STATE
// ─────────────────────────────────────────────────────────────────────────────

// The watermark lives under the session's own working folder, as the spec gate
// and decision capture keep theirs, so a session that may not write into the
// checkout, such as a sandboxed scratch run, can still record what it injected.
// A payload without an absolute folder falls back to the checkout.
function stateDirFor(payload, workspace) {
  const cwd = typeof payload?.cwd === 'string' ? payload.cwd.trim() : '';
  return join(cwd && isAbsolute(cwd) ? cwd : workspace, STATE_RELATIVE_DIR);
}

function stateKey(sessionId) {
  return createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
}

function watermarkPath(stateDir, sessionId) {
  return join(stateDir, `${stateKey(sessionId)}.json`);
}

function sizePath(stateDir, sessionId) {
  return join(stateDir, `${stateKey(sessionId)}.size`);
}

// A compaction folded into a later snapshot generation is read again under that
// generation's sequence, which is above the watermark, so the ids already
// injected are kept beside it. The list is bounded so the state file stays small.
const MAX_SEEN_COMPACTIONS = 64;

function readWatermark(stateDir, sessionId) {
  try {
    const raw = readFileSync(watermarkPath(stateDir, sessionId), 'utf8');
    if (raw.length > MAX_STATE_BYTES) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Number.isFinite(parsed.sequence) || parsed.sequence < 0) return null;
    return {
      compactionId: typeof parsed.compactionId === 'string' ? parsed.compactionId : null,
      sequence: parsed.sequence,
      seen: Array.isArray(parsed.seen) ? parsed.seen.filter((id) => typeof id === 'string') : [],
    };
  } catch {
    return null;
  }
}

// The watermark moves before the text is returned, so a crash cannot repeat the
// same injection on every later turn. A failed write withholds the text instead:
// an injection that cannot be recorded would ride every turn.
function writeWatermark(stateDir, sessionId, compaction, previous) {
  try {
    const seen = [...new Set([
      ...(previous?.seen ?? []),
      ...(previous?.compactionId ? [previous.compactionId] : []),
      compaction.compactionId,
    ])].slice(-MAX_SEEN_COMPACTIONS);
    mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    const target = watermarkPath(stateDir, sessionId);
    const temporary = `${target}.tmp`;
    writeFileSync(temporary, JSON.stringify({
      compactionId: compaction.compactionId,
      sequence: compaction.sequence,
      seen,
    }), { mode: 0o600 });
    renameSync(temporary, target);
    return true;
  } catch {
    return false;
  }
}

function readJournalSize(stateDir, sessionId) {
  try {
    const raw = readFileSync(sizePath(stateDir, sessionId), 'utf8').trim();
    const size = Number(raw);
    return Number.isFinite(size) && size >= 0 ? size : null;
  } catch {
    return null;
  }
}

function writeJournalSize(stateDir, sessionId, size) {
  try {
    mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    writeFileSync(sizePath(stateDir, sessionId), String(size), { mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HISTORY LOOKUP
// ─────────────────────────────────────────────────────────────────────────────

function historyReady() {
  return capabilities.vibe?.status === 'ready';
}

/**
 * Mint the locator for one compacted session.
 *
 * The handle binds the session root the hook received, which is the same path
 * the CLI resolves from `VIBE_HOME` for this session id. The placement is keyed
 * by the checkout root above the session folder, where the printed command runs.
 */
function mintLocator({ sessionId, workspace, transcriptPath, mintedAt }) {
  if (!historySupport) return null;
  const placement = historySupport.offer.placeLookup(workspace);
  if (!placement) return null;
  const identity = {
    runtime: 'vibe',
    sessionId,
    ...placement,
    locatorKind: HISTORY_LOCATOR_KIND,
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: historySupport.digest.historyHandle(identity, transcriptPath),
    mintedAt,
    provenance: { source: HISTORY_LOCATOR_SOURCE, capturedAt: mintedAt },
  };
}

// The CLI reads the locator from the hook state keyed by the workspace, so the
// offer is printed only after that write succeeded.
function persistLocator(locator) {
  if (!historySupport) return false;
  return historySupport.digest.persistHistoryLocator(locator, () => {
    historySupport.state.ensureStateDir();
    return historySupport.state.updateState(locator.sessionId, { historyLocator: locator });
  });
}

function historySection({ sessionId, workspace, transcriptPath, mintedAt }) {
  try {
    if (!historyReady()) return '';
    const locator = mintLocator({ sessionId, workspace, transcriptPath, mintedAt });
    if (!locator || !persistLocator(locator)) return '';
    return historySupport.offer.buildHistoryLookupSection(locator, true) ?? '';
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HANDOFF POINTER
// ─────────────────────────────────────────────────────────────────────────────

function handoffSection(sessionId, env) {
  try {
    const notePath = openNotePathFor({ repoRoot: resolveRepoRoot(env), sessionId });
    if (!notePath) return '';
    return [
      '## Handoff',
      `An open handoff note survives this compaction: ${notePath}`,
      `Claim it with: ${claimCommandFor(notePath, sessionId)}`,
    ].join('\n');
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DETECTOR
// ─────────────────────────────────────────────────────────────────────────────

function resetDirectiveReceipt(sessionId) {
  if (!directiveSupport) return false;
  try {
    return directiveSupport.advanceDirectiveLifecycleBoundary(
      directiveSupport.defaultDirectiveLifecycleStore(),
      sessionId,
    );
  } catch {
    return false;
  }
}

/**
 * Build the compaction context for one Vibe payload, or nothing.
 *
 * @param {Object} payload - The Vibe `pre_agent` or `post_tool` payload.
 * @param {Object} [options] - Environment, workspace, state and injectable parts.
 * @param {NodeJS.ProcessEnv} [options.env] - Environment holding VIBE_SPEC_FOLDER.
 * @param {string} [options.workspace] - Checkout the goal slice resolves against.
 * @param {string} [options.stateDir] - Watermark directory, replaced in tests.
 * @param {Function} [options.readSession] - The journal reader, replaced in tests.
 * @param {Function} [options.listCompactions] - The compaction list, replaced in tests.
 * @param {Function} [options.goalSlice] - The slice renderer, replaced in tests.
 * @param {Function} [options.resetReceipt] - The directive boundary, replaced in tests.
 * @param {Function} [options.now] - The clock, replaced in tests.
 * @returns {string} The re-injected text, or an empty string.
 */
export function buildCompactionPart(payload, {
  env = process.env,
  workspace = REPO_ROOT,
  stateDir = stateDirFor(payload, workspace),
  readSession = loadVibeSession,
  listCompactions = compactionsSince,
  goalSlice = renderVibeGoalSlice,
  resetReceipt = resetDirectiveReceipt,
  now = () => new Date(),
} = {}) {
  try {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '';
    const sessionId = typeof payload.session_id === 'string' ? payload.session_id.trim() : '';
    const transcriptPath = typeof payload.transcript_path === 'string'
      ? payload.transcript_path.trim()
      : '';
    if (!sessionId || !transcriptPath) return '';

    const session = readSession({ transcriptPath, sessionId });
    if (!session || session.ok !== true) return '';

    const watermark = readWatermark(stateDir, sessionId);
    const seen = new Set([...(watermark?.seen ?? []), ...(watermark?.compactionId ? [watermark.compactionId] : [])]);
    const listed = listCompactions(session, watermark?.sequence ?? 0);
    const compactions = Array.isArray(listed)
      ? listed.filter((compaction) => !seen.has(compaction?.compactionId))
      : [];
    if (compactions.length === 0) return '';

    const latest = compactions[compactions.length - 1];
    if (!latest || typeof latest.compactionId !== 'string' || !Number.isFinite(latest.sequence)) {
      return '';
    }
    if (!writeWatermark(stateDir, sessionId, latest, watermark)) return '';

    // The boundary is advanced before the text is built, so the advisor part
    // that runs later in the same turn already sees the re-armed receipt.
    try {
      resetReceipt(sessionId);
    } catch {
      // A receipt that cannot be advanced only costs a suppressed directive.
    }

    const sections = [];
    try {
      const slice = String(goalSlice({ env, workspace }) ?? '').trim();
      if (slice) sections.push(slice);
    } catch {
      // A missing packet or goal document leaves the other sections intact.
    }

    const sessionDirectory = typeof payload.cwd === 'string' && payload.cwd.trim()
      ? payload.cwd.trim()
      : workspace;
    const mintedAt = now().toISOString();
    const lookup = historySection({
      sessionId,
      workspace: sessionDirectory,
      transcriptPath,
      mintedAt,
    });
    if (lookup) sections.push(lookup);

    const handoff = handoffSection(sessionId, env);
    if (handoff) sections.push(handoff);

    if (sections.length === 0) return '';
    return [COMPACTION_HEADING, ...sections].join('\n\n');
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. POST-TOOL BINDING
// ─────────────────────────────────────────────────────────────────────────────

const JOURNAL_NAME = /^\d+\.jsonl$/;

/**
 * The total byte size of a session's journal files, or null when unreadable.
 *
 * A directory's own mtime does not move when a file inside it grows, so the
 * binding sums the journal files' sizes instead of statting the session root.
 */
export function measureJournal(transcriptPath) {
  try {
    const directory = join(transcriptPath, 'journal');
    const names = readdirSync(directory).filter((name) => JOURNAL_NAME.test(name));
    if (names.length === 0) return null;
    let total = 0;
    for (const name of names) total += statSync(join(directory, name)).size;
    return total;
  } catch {
    return null;
  }
}

/**
 * Run the detector after a tool call only when the journal grew.
 *
 * A headless turn can compact in the middle of its work, where no next turn
 * start follows. The size check keeps every other tool call down to a readdir
 * and a few stats; the detector's watermark still decides whether anything is
 * injected.
 *
 * @param {Object} payload - The Vibe `post_tool` payload.
 * @param {Object} [options] - Environment, workspace, state and injectable parts.
 * @returns {string} The re-injected text, or an empty string.
 */
export function buildPostToolPart(payload, {
  env = process.env,
  workspace = REPO_ROOT,
  stateDir = stateDirFor(payload, workspace),
  journalSize = measureJournal,
  detect = buildCompactionPart,
  readSize = readJournalSize,
  writeSize = writeJournalSize,
} = {}) {
  try {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '';
    if (payload.hook_event_name !== 'post_tool') return '';
    const sessionId = typeof payload.session_id === 'string' ? payload.session_id.trim() : '';
    const transcriptPath = typeof payload.transcript_path === 'string'
      ? payload.transcript_path.trim()
      : '';
    if (!sessionId || !transcriptPath) return '';

    const size = journalSize(transcriptPath);
    if (size === null) return '';
    if (readSize(stateDir, sessionId) === size) return '';

    const text = String(detect(payload, { env, workspace, stateDir }) ?? '');
    writeSize(stateDir, sessionId, size);
    return text;
  } catch {
    return '';
  }
}
