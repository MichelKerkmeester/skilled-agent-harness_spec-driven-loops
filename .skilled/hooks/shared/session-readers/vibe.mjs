// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Journal Reader
// ───────────────────────────────────────────────────────────────────
// Vibe writes a hash-chained recovery journal under the session root a hook
// receives as `transcript_path`. The reader projects the public session state
// (`harness.public-session-state/v1`) and the completion records beside it, and
// never writes. Record shapes are the contract: `meta.json` carries no version
// and `export.json` is written only when the run ends, so an unknown shape fails
// the read instead of returning an empty success.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isoOr, parseJsonLines } from './project.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'vibe';
const LOCATOR_KIND = 'transcript_path';
const JOURNAL_DIRECTORY = 'journal';
const JOURNAL_NAME = /^\d+\.jsonl$/;
const GENERATIONS_DIRECTORY = 'generations';
const CHUNKS_DIRECTORY = 'chunks';
const GENERATION_NAME = /^\d+$/;
const CHUNK_ID = /^[0-9a-f]{64}$/;
const COMPACTION_ENTRY_PREFIX = 'checkpoint-compaction-';
const MAX_ID_LENGTH = 128;

// The record families this reader depends on. `transition_shape` and
// `recovery_journal_record_version` are Vibe's own recovery bookkeeping, so they
// are not required; a record whose `type` is unknown is ignored.
const KNOWN_RECORD_TYPES = new Set([
  'command_reserved',
  'core_input',
  'projection_delta',
  'action_intent',
  'action_result',
  'receipt_succeeded',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. JOURNAL DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

function failure(code) {
  return { ok: false, code };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function journalFiles(sessionRoot) {
  const directory = join(sessionRoot, JOURNAL_DIRECTORY);
  let names;
  try {
    names = readdirSync(directory);
  } catch {
    return null;
  }
  const files = names.filter((name) => JOURNAL_NAME.test(name)).sort();
  if (files.length === 0) return null;
  return { directory, files: files.map((name) => join(directory, name)) };
}

// An interactive session folds its journal into a snapshot generation at each
// quiet point: the projection entries up to `snapshot_sequence` move into
// content-addressed chunks, and the journal restarts after that sequence. A
// reader of the journal alone then misses every entry the snapshot took, such
// as a compaction checkpoint, so the committed snapshot is read as the base the
// journal tail applies to. `CURRENT` names the generation Vibe last committed,
// which skips a generation still being written. Any unreadable part returns
// null and the reader falls back to the journal alone.
function latestSnapshot(sessionRoot) {
  try {
    const current = JSON.parse(readFileSync(join(sessionRoot, 'CURRENT'), 'utf8'));
    const generation = isObject(current) ? current.generation : null;
    if (typeof generation !== 'string' || !GENERATION_NAME.test(generation)) return null;
    const folder = join(sessionRoot, GENERATIONS_DIRECTORY, generation);
    const manifest = JSON.parse(readFileSync(join(folder, 'manifest.json'), 'utf8'));
    const sequence = isObject(manifest) ? manifest.snapshot_sequence : null;
    if (!Number.isInteger(sequence) || sequence < 0) return null;
    const chunkIds = Array.isArray(manifest.projection_state?.chunks) ? manifest.projection_state.chunks : [];
    const entries = [];
    for (const chunkId of chunkIds) {
      if (typeof chunkId !== 'string' || !CHUNK_ID.test(chunkId)) return null;
      const chunk = JSON.parse(readFileSync(join(sessionRoot, CHUNKS_DIRECTORY, chunkId + '.json'), 'utf8'));
      if (!Array.isArray(chunk)) return null;
      entries.push(...chunk.filter(isObject));
    }
    const state = JSON.parse(readFileSync(join(folder, 'projection-state.json'), 'utf8'));
    const envelope = isObject(state) && isObject(state.snapshot) ? state.snapshot : null;
    return { sequence, entries, envelope };
  } catch {
    return null;
  }
}

// The snapshot as one projection record, so the replay and the compaction
// lookup read it through the same path as a journal delta.
function snapshotRecord(snapshot) {
  const delta = [];
  if (snapshot.envelope) delta.push({ op: 'set_envelope', state: snapshot.envelope });
  for (const entry of snapshot.entries) delta.push({ op: 'append_entry', entry });
  return { type: 'projection_delta', sequence: snapshot.sequence, payload: { delta } };
}

// A projection delta at or below the snapshot sequence is already inside the
// snapshot, and replaying it after the snapshot would put an older entry state
// back. Other record families are kept: the snapshot carries none of them.
function withSnapshot(records, snapshot) {
  if (!snapshot) return records;
  const tail = records.filter((record) => !(
    record.type === 'projection_delta'
    && Number.isInteger(record.sequence)
    && record.sequence <= snapshot.sequence
  ));
  return [snapshotRecord(snapshot), ...tail];
}

function readJournalRecords(files) {
  const records = [];
  for (const file of files) {
    records.push(...parseJsonLines(readFileSync(file, 'utf8')));
  }
  return records;
}

function knownRecords(records) {
  return records.filter((record) => (
    isObject(record)
    && typeof record.type === 'string'
    && KNOWN_RECORD_TYPES.has(record.type)
    && isObject(record.payload)
  ));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECORD ACCESS
// ─────────────────────────────────────────────────────────────────────────────

function commandOf(record) {
  if (record.type !== 'core_input') return null;
  const command = record.payload?.input?.command;
  return isObject(command) ? command : null;
}

function requestOf(record) {
  if (record.type !== 'action_intent') return null;
  const request = record.payload?.request;
  return isObject(request) ? request : null;
}

function completionText(command) {
  const parts = command?.result?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .filter((part) => isObject(part) && part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('');
  return text || null;
}

function messageText(entry) {
  const content = entry?.content;
  if (!Array.isArray(content)) return null;
  const text = content
    .filter((block) => isObject(block) && block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('');
  return text || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PROJECTION REPLAY
// ─────────────────────────────────────────────────────────────────────────────

// The projection is a stream of deltas: `append_entry` adds an entry,
// `replace_entry` rewrites one in place, and `set_envelope` carries the session
// envelope. Replaying them in journal order yields the public session state.
function replayProjection(records) {
  const entries = new Map();
  let latestTurnId = null;
  let envelope = null;

  for (const record of records) {
    if (record.type !== 'projection_delta') continue;
    const delta = record.payload?.delta;
    if (!Array.isArray(delta)) continue;

    for (const operation of delta) {
      if (!isObject(operation)) continue;
      if (operation.op === 'set_envelope' && isObject(operation.state)) {
        envelope = operation.state;
        const turn = operation.state.latestTurn;
        if (isObject(turn) && typeof turn.id === 'string' && turn.id) latestTurnId = turn.id;
        const active = operation.state.session?.status?.activeTurnId;
        if (typeof active === 'string' && active) latestTurnId = active;
        continue;
      }
      if (operation.op !== 'append_entry' && operation.op !== 'replace_entry') continue;
      const entry = operation.entry;
      if (!isObject(entry) || typeof entry.id !== 'string' || !entry.id) continue;
      entries.set(entry.id, entry);
      if (typeof entry.turnId === 'string' && entry.turnId) latestTurnId = entry.turnId;
    }
  }

  return { entries: [...entries.values()], envelope, latestTurnId };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TURN AND COMPLETION LOOKUP
// ─────────────────────────────────────────────────────────────────────────────

// A completion command carries an `action_id` but no turn; the intent that
// reserved the call carries the turn. Compaction summaries are completions too,
// so their actions are excluded: a summary is not a reply.
function completionTurns(records) {
  const turns = new Map();
  const compactionActions = new Set();
  for (const record of records) {
    const request = requestOf(record);
    if (!request || typeof request.action_id !== 'string') continue;
    if (typeof request.compaction_id === 'string' && request.compaction_id) {
      compactionActions.add(request.action_id);
      continue;
    }
    if (typeof request.turn_id === 'string' && request.turn_id) {
      turns.set(request.action_id, request.turn_id);
    }
  }
  return { turns, compactionActions };
}

function lastCompletion(records, turn) {
  const { turns, compactionActions } = completionTurns(records);
  let matched = null;
  let unmatched = null;
  for (const record of records) {
    const command = commandOf(record);
    if (!command || command.type !== 'completion_succeeded') continue;
    if (compactionActions.has(command.action_id)) continue;
    const text = completionText(command);
    if (!text) continue;
    const commandTurn = turns.get(command.action_id);
    if (!turn || commandTurn === turn) matched = text;
    else if (!commandTurn) unmatched = text;
  }
  return matched ?? unmatched;
}

function lastMessageText(entries, turn) {
  let found = null;
  for (const entry of entries) {
    if (entry.type !== 'message' || entry.role !== 'assistant') continue;
    if (turn && entry.turnId !== turn) continue;
    const text = messageText(entry);
    if (text) found = text;
  }
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMPACTION LOOKUP
// ─────────────────────────────────────────────────────────────────────────────

function compactionOf(entry, sequence) {
  if (entry.type !== 'checkpoint' || entry.kind !== 'compaction') return null;
  const details = isObject(entry.details) ? entry.details : {};
  const compactionId = typeof entry.id === 'string' && entry.id.startsWith(COMPACTION_ENTRY_PREFIX)
    ? entry.id.slice(COMPACTION_ENTRY_PREFIX.length)
    : entry.id;
  return {
    compactionId,
    trigger: typeof details.trigger === 'string' ? details.trigger : null,
    attempt: Number.isInteger(details.attempt) ? details.attempt : null,
    summaryLength: Number.isInteger(details.summaryLength) ? details.summaryLength : null,
    turnId: typeof entry.turnId === 'string' ? entry.turnId : null,
    status: typeof entry.generationStatus === 'string' ? entry.generationStatus : null,
    sequence,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. NEUTRAL RECORDS
// ─────────────────────────────────────────────────────────────────────────────

// The shared projection takes message records only. Tool effects stay reachable
// through `turnToolCalls`, so a caller that needs the calls never re-parses the
// journal and the projected entry list never carries an unpaired call.
function neutralRecords(entries) {
  const records = [];
  const seen = new Set();
  for (const entry of entries) {
    if (entry.type !== 'message') continue;
    if (entry.role !== 'user' && entry.role !== 'assistant') continue;
    if (typeof entry.id !== 'string' || !entry.id || seen.has(entry.id)) continue;
    const content = Array.isArray(entry.content)
      ? entry.content
        .filter((block) => isObject(block) && block.type === 'text' && typeof block.text === 'string')
        .map((block) => ({ type: 'text', text: block.text }))
      : [];
    if (content.length === 0) continue;
    seen.add(entry.id);
    records.push({
      id: entry.id.slice(0, MAX_ID_LENGTH),
      role: entry.role,
      timestamp: isoOr(entry.createdAt),
      content,
    });
  }
  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. LOADER
// ─────────────────────────────────────────────────────────────────────────────

function recordedSessionId(sessionRoot, entries) {
  try {
    const meta = JSON.parse(readFileSync(join(sessionRoot, 'meta.json'), 'utf8'));
    if (isObject(meta) && typeof meta.session_id === 'string' && meta.session_id) {
      return meta.session_id;
    }
  } catch {
    // A session without meta.json is still readable from its journal.
  }
  const entry = entries.find((item) => typeof item.sessionId === 'string' && item.sessionId);
  return entry ? entry.sessionId : null;
}

/**
 * Read one Vibe session journal from the session root a hook receives.
 * @param {{ transcriptPath?: string, sessionId?: string }} [options] - The
 *   hook payload's `transcript_path` (the session storage root), and the session
 *   id to prove when the caller has one.
 * @returns {{ ok: true, source: object, records: Array<object>, entries: Array<object>,
 *   journalRecords: Array<object>, turn: string | null }
 *   | { ok: false, code: string }}
 */
export function loadVibeSession({ transcriptPath, sessionId } = {}) {
  if (typeof transcriptPath !== 'string' || !transcriptPath.trim()) {
    return failure('locator_unavailable');
  }
  const sessionRoot = transcriptPath.trim();

  const journal = journalFiles(sessionRoot);
  if (!journal) return failure('session_not_found');

  let records;
  try {
    records = readJournalRecords(journal.files);
  } catch {
    return failure('store_unreadable');
  }

  const known = withSnapshot(knownRecords(records), latestSnapshot(sessionRoot));
  if (known.length === 0) return failure('unsupported_format');

  const projection = replayProjection(known);
  const hasProjection = known.some((record) => (
    record.type === 'projection_delta' && Array.isArray(record.payload?.delta)
  ));
  // A journal without the public projection cannot answer the reply or the turn,
  // so it is a format this reader does not know rather than an empty session.
  if (!hasProjection || projection.entries.length === 0) return failure('unsupported_format');

  const recordedId = recordedSessionId(sessionRoot, projection.entries);
  if (typeof sessionId === 'string' && sessionId.trim() && recordedId && recordedId !== sessionId) {
    return failure('session_mismatch');
  }

  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId: recordedId ?? sessionId ?? null,
      locatorKind: LOCATOR_KIND,
      storePath: sessionRoot,
      journalPath: journal.directory,
    },
    records: neutralRecords(projection.entries),
    entries: projection.entries,
    journalRecords: known,
    turn: projection.latestTurnId,
  };
}

function asSession(input) {
  if (isObject(input) && input.ok === true && Array.isArray(input.entries)) return input;
  return loadVibeSession(input);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The reply of the session's current turn. The completion record is preferred
 * over the projection message because Vibe runs a `post_agent` hook before it
 * appends that message, so at hook time only the completion carries the reply.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {string | null} The reply text, or null when the turn has none.
 */
export function lastAssistantText(input) {
  const session = asSession(input);
  if (!session.ok) return null;
  const turn = session.turn;
  return lastCompletion(session.journalRecords, turn)
    ?? lastMessageText(session.entries, turn)
    ?? lastMessageText(session.entries, null);
}

/**
 * The current turn's tool calls, in the order they started.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {Array<{ id: string, name: string, input: object, status: string | null,
 *   outputText: string | null }>}
 */
export function turnToolCalls(input) {
  const session = asSession(input);
  if (!session.ok) return [];
  const turn = session.turn;
  const calls = [];
  for (const entry of session.entries) {
    if (entry.type !== 'effect' || entry.turnId !== turn) continue;
    const detail = isObject(entry.detail) ? entry.detail : {};
    if (detail.kind !== 'tool' || typeof detail.toolName !== 'string') continue;
    const state = isObject(entry.state) ? entry.state : {};
    calls.push({
      id: typeof entry.id === 'string' ? entry.id : '',
      name: detail.toolName,
      input: isObject(detail.input) ? detail.input : {},
      status: typeof state.status === 'string' ? state.status : null,
      outputText: typeof state.outputText === 'string' ? state.outputText : null,
    });
  }
  return calls;
}

/**
 * The compactions recorded after a journal watermark.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @param {number} [watermark] - The `sequence` of the last compaction already seen.
 * @returns {Array<{ compactionId: string, trigger: string | null, attempt: number | null,
 *   summaryLength: number | null, turnId: string | null, status: string | null,
 *   sequence: number }>}
 */
export function compactionsSince(input, watermark = 0) {
  const session = asSession(input);
  if (!session.ok) return [];
  const floor = Number.isFinite(watermark) ? watermark : 0;
  const byId = new Map();
  for (const record of session.journalRecords) {
    if (record.type !== 'projection_delta') continue;
    const delta = record.payload?.delta;
    if (!Array.isArray(delta)) continue;
    for (const operation of delta) {
      if (!isObject(operation) || !isObject(operation.entry)) continue;
      if (operation.op !== 'append_entry' && operation.op !== 'replace_entry') continue;
      const compaction = compactionOf(operation.entry, record.sequence);
      if (!compaction) continue;
      // A completed entry replaces the running one under the same id, so the
      // last write wins and the caller sees one record per compaction.
      byId.set(compaction.compactionId, compaction);
    }
  }
  return [...byId.values()]
    .filter((compaction) => compaction.sequence > floor)
    .sort((left, right) => left.sequence - right.sequence);
}

/**
 * The session's current turn id. A retry keeps it, so it is the key a
 * once-per-turn rule can hold across the retries Vibe counts for one turn.
 * @param {object} input - A loaded session, or the options `loadVibeSession` takes.
 * @returns {string | null}
 */
export function turnId(input) {
  const session = asSession(input);
  if (!session.ok) return null;
  if (session.turn) return session.turn;
  let found = null;
  for (const record of session.journalRecords) {
    const command = commandOf(record);
    if (command && typeof command.turn_id === 'string' && command.turn_id) found = command.turn_id;
    const request = requestOf(record);
    if (request && typeof request.turn_id === 'string' && request.turn_id) found = request.turn_id;
  }
  return found;
}
