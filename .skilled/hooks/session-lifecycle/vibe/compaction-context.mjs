#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Compaction Context Detector
// ───────────────────────────────────────────────────────────────────
// Vibe has no compaction hook, and session_start does not run again after an
// automatic compaction, so the bound packet's goal slice and the open handoff
// pointer are gone for the rest of the run. The journal records every
// compaction, so this detector compares those entries with a per-session
// watermark and rebuilds that context once per compaction.
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
import { compactionsSince, loadVibeSession } from '../../shared/session-readers/vibe.mjs';

const require = createRequire(import.meta.url);
const {
  claimCommandFor,
  handoffPending,
  handoffWithdrawn,
  openNotePathFor,
  resolveRepoRoot,
  staleNoteText,
  writeState,
} = require('../../session-handover/lib/nudge.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A Vibe session runs in a throwaway folder, so the checkout is located from
// this file instead: vibe -> session-lifecycle -> hooks -> .skilled -> root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const STATE_RELATIVE_DIR = '.skilled/skills/.state/vibe-compaction';
const MAX_STATE_BYTES = 4096;

const COMPACTION_HEADING = 'Context restored after a compaction.';

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
// The folder must already exist as a directory, so a payload cannot make the
// detector create a directory tree anywhere it names. A payload without such a
// folder falls back to the checkout.
function stateDirFor(payload, workspace) {
  const cwd = typeof payload?.cwd === 'string' ? payload.cwd.trim() : '';
  return join(existingDirectory(cwd) ? cwd : workspace, STATE_RELATIVE_DIR);
}

function existingDirectory(candidate) {
  if (!candidate || !isAbsolute(candidate)) return false;
  try {
    return statSync(candidate).isDirectory();
  } catch {
    return false;
  }
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
// consumed are kept beside it. The list keeps the newest 64 ids so the state
// file stays within MAX_STATE_BYTES; a session would need more than 64
// compactions before an evicted id could be read again, and the snapshot only
// replays the compactions its own generation holds.
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

// The watermark moves before the text is built, and it moves even when there is
// nothing to inject. A session with no bound goal and no open note is the common
// case, and leaving its compaction unconsumed would re-detect it on every later
// turn, re-arming the advisor directive each time. A failed write withholds the
// text instead: an injection that cannot be recorded would ride every turn.
// Every id in this catch-up joins the seen list, not just the latest, so a
// snapshot roll that replays an older one cannot inject it again.
function writeWatermark(stateDir, sessionId, compactions, previous) {
  try {
    const latest = compactions[compactions.length - 1];
    const seen = [...new Set([
      ...(previous?.seen ?? []),
      ...(previous?.compactionId ? [previous.compactionId] : []),
      ...compactions.map((compaction) => compaction.compactionId),
    ])].slice(-MAX_SEEN_COMPACTIONS);
    mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    const target = watermarkPath(stateDir, sessionId);
    const temporary = `${target}.tmp`;
    writeFileSync(temporary, JSON.stringify({
      compactionId: latest.compactionId,
      sequence: latest.sequence,
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
// 4. HANDOFF POINTER
// ─────────────────────────────────────────────────────────────────────────────

function handoffSection(sessionId, env, {
  pending = handoffPending,
  withdrawn = handoffWithdrawn,
  notePathFor = openNotePathFor,
} = {}) {
  try {
    // A prepared hop already owns the note; pointing this session at a claim would leave
    // the fresh session nothing to claim.
    if (pending({ sessionId, env })) return '';
    const notePath = notePathFor({ repoRoot: resolveRepoRoot(env), sessionId });
    if (!notePath) return '';
    // The operator withdrew the hand-over after this note was written, so the work since is
    // not in it, and claiming it would resume work that is already done.
    if (withdrawn({ sessionId, notePath, env })) return staleNoteText({ notePath });
    return [
      '## Handoff',
      `An open handoff note survives this compaction: ${notePath}`,
      `Claim it with: ${claimCommandFor(notePath, sessionId)}`,
    ].join('\n');
  } catch {
    return '';
  }
}

// A compaction frees the context, so the next fill climbs from the start and earns its nudges
// again. Best effort: a level that cannot be written only costs a nudge.
function resetNudgeLevel(sessionId, env) {
  try {
    writeState(sessionId, 0, env);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DETECTOR
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
 * @param {Function} [options.resetNudge] - The nudge level reset, replaced in tests.
 * @param {Object} [options.handoff] - The hand-over state readers, replaced in tests.
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
  resetNudge = resetNudgeLevel,
  handoff = {},
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
      ? listed.filter((compaction) => typeof compaction?.compactionId === 'string'
        && Number.isFinite(compaction.sequence)
        && !seen.has(compaction.compactionId))
      : [];
    if (compactions.length === 0) return '';
    if (!writeWatermark(stateDir, sessionId, compactions, watermark)) return '';

    // The boundary is advanced before the text is built, so the advisor part
    // that runs later in the same turn already sees the re-armed receipt.
    try {
      resetReceipt(sessionId);
    } catch {
      // A receipt that cannot be advanced only costs a suppressed directive.
    }

    resetNudge(sessionId, env);

    const sections = [];
    try {
      const slice = String(goalSlice({ env, workspace }) ?? '').trim();
      if (slice) sections.push(slice);
    } catch {
      // A missing packet or goal document leaves the other sections intact.
    }

    const handoffText = handoffSection(sessionId, env, handoff);
    if (handoffText) sections.push(handoffText);

    if (sections.length === 0) return '';
    return [COMPACTION_HEADING, ...sections].join('\n\n');
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. POST-TOOL BINDING
// ─────────────────────────────────────────────────────────────────────────────

const JOURNAL_NAME = /^\d+\.jsonl$/;

/**
 * The total byte size of a session's journal files, or null when unreadable.
 *
 * A directory's own mtime does not move when a file inside it grows, so the
 * binding sums the journal files' sizes instead of statting the session root.
 * Only the numbered journal files are watched. A compaction appends records to
 * them and a snapshot roll rewrites them, so either changes the sum; a miss
 * needs the new sum to equal the recorded one exactly. A journal folder
 * with no file yet, as right after a roll, measures 0 rather than unreadable.
 */
export function measureJournal(transcriptPath) {
  try {
    const directory = join(transcriptPath, 'journal');
    const names = readdirSync(directory).filter((name) => JOURNAL_NAME.test(name));
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

    // The size is recorded even when the detector returned no text. Only the
    // watermark decides whether a compaction was consumed, so a journal that
    // grows again, or the next turn start, still finds one that was not.
    const text = String(detect(payload, { env, workspace, stateDir }) ?? '');
    writeSize(stateDir, sessionId, size);
    return text;
  } catch {
    return '';
  }
}
