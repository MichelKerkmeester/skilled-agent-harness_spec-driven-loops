// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Compaction Pointer
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { appendLog, isEntrypoint, parseHandoff, payloadEventName } from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
// The spec-kit runtime's hooks/claude/shared.ts keeps a TypeScript copy of this fork check;
// change both windows together.
const FORK_COMPACTION_WINDOW_MS = 5000;
const FORK_TRANSCRIPT_MTIME_WINDOW_MS = 10000;
const TRANSCRIPT_TAIL_BYTES = 64 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

// The envelope flushes before exit so a piped stdout cannot truncate it.
function emit(eventName, text) {
  const envelope = { hookSpecificOutput: { hookEventName: eventName, additionalContext: text } };
  process.stdout.write(JSON.stringify(envelope), done);
}

// Logging is best-effort: a state-dir failure must never break the hook.
function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

function noteSpecFolder(notePath) {
  try {
    const folder = parseHandoff(fs.readFileSync(notePath, 'utf8')).frontmatter.spec_folder;
    return typeof folder === 'string' ? folder : '';
  } catch {
    return '';
  }
}

// A fork files its own transcript under its parent's session directory, so a compaction
// boundary there is the fork's. The record's own timestamp decides; the mtime check only
// keeps stale transcripts from being read at all.
function forkCompactedRecently(transcriptPath, sessionId, nowMs = Date.now()) {
  const directory = path.join(path.dirname(transcriptPath), sessionId, 'subagents');
  let entries = [];
  try {
    entries = fs.readdirSync(directory);
  } catch {
    return false;
  }

  for (const entry of entries) {
    if (!/^agent-.*\.jsonl$/.test(entry)) continue;
    const filePath = path.join(directory, entry);
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;
      if (Math.abs(nowMs - stat.mtimeMs) > FORK_TRANSCRIPT_MTIME_WINDOW_MS) continue;
      const timestamp = lastCompactBoundaryTimestamp(filePath);
      if (timestamp === null) continue;
      const age = nowMs - timestamp;
      if (age >= 0 && age <= FORK_COMPACTION_WINDOW_MS) return true;
    } catch {}
  }
  return false;
}

function lastCompactBoundaryTimestamp(filePath) {
  const { size } = fs.statSync(filePath);
  const length = Math.min(size, TRANSCRIPT_TAIL_BYTES);
  const buffer = Buffer.alloc(length);
  const descriptor = fs.openSync(filePath, 'r');
  let read = 0;
  try {
    read = fs.readSync(descriptor, buffer, 0, length, size - length);
  } finally {
    fs.closeSync(descriptor);
  }

  const lines = buffer.subarray(0, read).toString('utf8').split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index].includes('"compact_boundary"')) continue;
    const timestamp = Date.parse(JSON.parse(lines[index]).timestamp);
    return Number.isFinite(timestamp) ? timestamp : null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// A compacted session keeps its id but loses the detail its handoff note holds, so the
// session is pointed back at that note. Compaction also frees the context the spent
// nudge level was measured against, so the level resets and the next fill nudges again.
async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, loadConfigFile(configPath()));
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();
  if (payload.source !== 'compact') return done();

  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  // A forked sub-agent carries its parent's session id, so a fork's compaction reports
  // under the parent's id and must not reach the parent's note or nudge level.
  const transcriptPath = payload.transcript_path;
  if (typeof transcriptPath !== 'string' || transcriptPath === '') {
    logEvent('compact-pointer-skipped', { sessionId, reason: 'no-transcript' });
    return done();
  }
  if (path.basename(transcriptPath) !== `${sessionId}.jsonl`) {
    logEvent('compact-pointer-skipped', { sessionId, reason: 'not-session-transcript' });
    return done();
  }
  if (forkCompactedRecently(transcriptPath, sessionId)) {
    logEvent('compact-pointer-skipped', { sessionId, reason: 'fork-compaction' });
    return done();
  }

  try {
    nudge.writeState(sessionId, 0);
  } catch (error) {
    logEvent('compact-pointer-error', { stage: 'state', message: error.message });
  }

  // A prepared hop already owns the note; claiming it here would leave the fresh
  // session nothing to claim.
  if (nudge.handoffPending({ sessionId })) return done();

  const notePath = nudge.openNotePathFor({ repoRoot: nudge.resolveRepoRoot(), sessionId });
  if (notePath === null) return done();

  // The operator withdrew the hand-over after this note was written, so the work since is not in
  // it; pointing the session at a claim would resume work that is already done.
  if (nudge.handoffWithdrawn({ sessionId, notePath })) {
    logEvent('compact-pointer-stale-note', { sessionId, note: notePath });
    return emit(payloadEventName(payload, { runtime: 'claude' }), nudge.staleNoteText({ notePath }));
  }

  logEvent('compact-pointer', { sessionId, note: notePath });
  return emit(payloadEventName(payload, { runtime: 'claude' }), nudge.seedText({
    notePath,
    specFolder: noteSpecFolder(notePath),
    sessionId,
    cliPath: nudge.CLI_COMMAND,
    afterCompaction: true,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
