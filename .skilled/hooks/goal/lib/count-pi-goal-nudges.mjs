// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: count-pi-goal-nudges census CLI                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Counts goal-verifier nudges in Pi session logs: one line per    ║
// ║          session file with nudges, then totals, with counts by verdict   ║
// ║          and by reason category, plus first and last nudge dates.        ║
// ║          Message content is never printed.                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NUDGE_CUSTOM_TYPE = 'goal-verify-nudge';
const NUDGE_PATTERN = /^\[goal_verify\] verdict=([^;]*); reason=([\s\S]*)$/;
const KNOWN_RECORD_TYPES = new Set([
  'session',
  'message',
  'thinking_level_change',
  'model_change',
  'usage',
  'compaction',
  'branch_summary',
  'custom',
  'custom_message',
  'context_edit',
  'label',
  'session_info',
]);
const REASON_CATEGORIES = new Map([
  ['Evidence is too short to prove completion', 'too_short'],
  ['Evidence includes blocking or incomplete-work language', 'blocking'],
  ['Evidence appears truncated before it proves completion', 'truncated'],
  ['Evidence lacks an explicit completion signal', 'no_completion'],
  ['Evidence does not reference the goal objective specifically enough', 'weak_link'],
]);
const DATE_PREFIX_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TYPE_CHARS = 40;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLI ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function fail(message, code) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function parseDirArgument(argv) {
  const flagIndex = argv.indexOf('--dir');
  if (flagIndex === -1) return null;
  return argv[flagIndex + 1] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DIRECTORY WALK
// ─────────────────────────────────────────────────────────────────────────────

function collectJsonlPaths(baseDir) {
  const found = [];
  const pending = [''];
  while (pending.length > 0) {
    const relative = pending.pop();
    const absolute = relative === '' ? baseDir : join(baseDir, relative);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const childRelative = relative === '' ? entry.name : `${relative}/${entry.name}`;
      if (entry.isDirectory()) pending.push(childRelative);
      else if (entry.isFile() && entry.name.endsWith('.jsonl')) found.push(childRelative);
    }
  }
  // Sort once here so every report walks files in the same order.
  found.sort();
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RECORD HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readRecordContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .filter((part) => part !== null && typeof part === 'object' && part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n');
  }
  return null;
}

function classifyReason(reason) {
  return REASON_CATEGORIES.get(reason) ?? 'other';
}

function recordDate(timestamp) {
  if (typeof timestamp !== 'string') return null;
  const prefix = timestamp.slice(0, 10);
  return DATE_PREFIX_PATTERN.test(prefix) ? prefix : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

function emptyTally() {
  return {
    nudges: 0,
    'not-met': 0,
    unclear: 0,
    other_verdict: 0,
    too_short: 0,
    blocking: 0,
    truncated: 0,
    no_completion: 0,
    weak_link: 0,
    other: 0,
    first: null,
    last: null,
  };
}

function extendWindow(tally, date) {
  if (date === null) return;
  if (tally.first === null || date < tally.first) tally.first = date;
  if (tally.last === null || date > tally.last) tally.last = date;
}

function countNudge(tally, verdictKey, reasonKey, date) {
  tally.nudges += 1;
  tally[verdictKey] += 1;
  tally[reasonKey] += 1;
  extendWindow(tally, date);
}

function scanDirectory(dir) {
  const files = collectJsonlPaths(dir);
  const sessions = [];
  const totals = emptyTally();
  for (const relative of files) {
    const session = emptyTally();
    const lines = readFileSync(join(dir, relative), 'utf8').split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      const raw = lines[index];
      if (raw.trim() === '') continue;
      const lineNumber = index + 1;
      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        fail(`error: MALFORMED_RECORD file=${relative} line=${lineNumber}`, 1);
      }
      const type = record !== null && typeof record === 'object' ? record.type : undefined;
      if (!KNOWN_RECORD_TYPES.has(type)) {
        fail(
          `error: UNKNOWN_RECORD_TYPE type=${String(type).slice(0, MAX_TYPE_CHARS)} file=${relative} line=${lineNumber}`,
          1,
        );
      }
      if (type !== 'custom_message' || record.customType !== NUDGE_CUSTOM_TYPE) continue;
      const content = readRecordContent(record.content);
      const match = typeof content === 'string' ? content.match(NUDGE_PATTERN) : null;
      const verdictKey = match !== null && (match[1] === 'not-met' || match[1] === 'unclear') ? match[1] : 'other_verdict';
      const reasonKey = match !== null ? classifyReason(match[2]) : 'other';
      const date = recordDate(record.timestamp);
      countNudge(session, verdictKey, reasonKey, date);
      countNudge(totals, verdictKey, reasonKey, date);
    }
    if (session.nudges > 0) sessions.push({ file: relative, tally: session });
  }
  return { files, sessions, totals };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function tallyCounters(tally) {
  return [
    `nudges=${tally.nudges}`,
    `not-met=${tally['not-met']}`,
    `unclear=${tally.unclear}`,
    `other_verdict=${tally.other_verdict}`,
    'met=not_recorded',
    `too_short=${tally.too_short}`,
    `blocking=${tally.blocking}`,
    `truncated=${tally.truncated}`,
    `no_completion=${tally.no_completion}`,
    `weak_link=${tally.weak_link}`,
    `other=${tally.other}`,
    `first=${tally.first ?? 'none'}`,
    `last=${tally.last ?? 'none'}`,
  ].join(' ');
}

function renderReport(dir) {
  const { files, sessions, totals } = scanDirectory(dir);
  const lines = [
    `method: unit=one custom_message record with customType goal-verify-nudge, files_scanned=${files.length}, window=${totals.first ?? 'none'}..${totals.last ?? 'none'} from the record timestamp field`,
  ];
  for (const session of sessions) {
    lines.push(`session: file=${session.file} ${tallyCounters(session.tally)}`);
  }
  lines.push(`totals: sessions_with_nudges=${sessions.length} ${tallyCounters(totals)}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────

const dir = parseDirArgument(process.argv.slice(2));
if (dir === null) {
  fail('error: MISSING_DIR --dir <path> is required', 2);
}

let dirStat = null;
try {
  dirStat = statSync(dir);
} catch {
  dirStat = null;
}
if (dirStat === null || !dirStat.isDirectory()) {
  fail(`error: DIR_NOT_FOUND ${dir}`, 2);
}

// Compute the whole census before printing so a bad record exits with empty
// stdout instead of a partial report.
process.stdout.write(`${renderReport(dir).join('\n')}\n`);
