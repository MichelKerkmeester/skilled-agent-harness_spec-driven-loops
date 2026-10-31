// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement
// ───────────────────────────────────────────────────────────────────
//
// Counts below-50 alignment saves per save path and replays both validator paths,
// with zero model calls. Past a 30-row label gate, an opt-in Jev or Deem column picks
// one of the folders a save listed. The script holds no credential and reads none.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { parseArgs } from 'node:util';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';
import { isArchiveFolder, validateContentAlignment, validateFolderAlignment, type AlignmentCollectedData } from '../spec-folder/alignment-validator.js';
import { isPathInsideRoot } from '../utils/path-utils.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND TYPES
// ───────────────────────────────────────────────────────────────────

/** Which validator produced a save: the interactive CLI path or the data path. */
export type SavePath = 'cli' | 'data';

/** Alignment band read from a decision line, never from a printed percentage. */
export type Band = 'aligned' | 'moderate' | 'low' | 'infrastructure';

/** One alignment save recovered from validator output. */
export interface AlignmentEvent {
  path: SavePath;
  band: Band;
  target: string | null;
  printedScore: number | null;
  alternatives: string[];
  hardBlock: boolean;
  pick: string | null;
}

/** Per-path census totals over a set of events. */
export interface PathCounts {
  aligned: number;
  moderate: number;
  low: number;
  infrastructure: number;
  below50: number;
  withAlternatives: number;
  withoutAlternatives: number;
  hardBlocks: number;
  picks: number;
}

const LABEL_GATE = 30;
const PASSES = 3;
const JEV_VERSION = 'jev 0.6.2';
const CHOICE_QUESTION = 'Which spec folder should this save go to?';
const NONE_KEY = 'none_of_these';
const NONE_DESCRIPTION = 'None of these folders';
const DEEM_MODEL = 'deem-0.8-v1';
const DEEM_P50_MS = 65.6;
const HEALTH_TIMEOUT_MS = 2000;
const CALL_TIMEOUT_MS = 90000;
const BACKOFF_MS = 2000;
const MARGIN_TEXT = '0.10';

const REPO_ROOT = path.resolve(dirnameFromImportMeta(import.meta.url), '..', '..', '..', '..', '..', '..');
const SPECS_ROOT = path.join(REPO_ROOT, 'specs');

// ───────────────────────────────────────────────────────────────────
// 3. LINE SCAN
// ───────────────────────────────────────────────────────────────────

const CLI_HEADER = /Phase 1B Alignment: (.+) \((\d+)% match\)\s*$/;
const DATA_HEADER = /Alignment check: (.+) \((\d+)% match\)\s*$/;

const CLI_ALIGNED = /^\s*(?:Warning: )?Content aligns with target folder\s*(?:"[,}\]].*)?$/;
const CLI_MODERATE = /^\s*(?:Warning: )?Moderate alignment \(\d+%\) - proceeding with caution\s*(?:"[,}\]].*)?$/;
const CLI_LOW = /^\s*(?:Warning: )?ALIGNMENT WARNING: Content may not match target folder\s*(?:"[,}\]].*)?$/;
const CLI_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE ALIGNMENT WARNING\s*(?:"[,}\]].*)?$/;

const DATA_ALIGNED = /^\s*(?:Warning: )?Good alignment with selected folder\s*(?:"[,}\]].*)?$/;
const DATA_MODERATE = /^\s*(?:Warning: )?Moderate alignment - proceeding with caution\s*(?:"[,}\]].*)?$/;
const DATA_LOW = /^\s*(?:Warning: )?LOW ALIGNMENT WARNING \(\d+% match\)\s*(?:"[,}\]].*)?$/;
const DATA_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE MISMATCH \(\d+% of files in \.(?:skilled|opencode)\/\)\s*(?:"[,}\]].*)?$/;

const TARGET_LINE = /^\s*Target folder: (.+) \((\d+)% match\)\s*$/;
const LIST_START = /^\s*(?:Better matching folders found|Better matching alternatives):\s*$/;
const LIST_ITEM = /^\s*\d+\. (.+) \((\d+)% match\)\s*$/;
const HARD_BLOCK = /^\s*ALIGNMENT_HARD_BLOCK:/;
const PICK_SWITCH = /^\s*Switching to: (.+?)\s*$/;
const PICK_REQUESTED = /^\s*(?:Continuing|Proceeding) with "(.+)" as requested\s*$/;

interface HeaderHit {
  path: SavePath;
  target: string;
  score: number;
  index: number;
}

interface DecisionHit {
  path: SavePath;
  band: Band;
}

function matchHeader(line: string): { path: SavePath; target: string; score: number } | null {
  const cli = CLI_HEADER.exec(line);
  if (cli) return { path: 'cli', target: cli[1], score: Number(cli[2]) };
  const data = DATA_HEADER.exec(line);
  if (data) return { path: 'data', target: data[1], score: Number(data[2]) };
  return null;
}

function matchDecision(line: string): DecisionHit | null {
  if (CLI_ALIGNED.test(line)) return { path: 'cli', band: 'aligned' };
  if (CLI_MODERATE.test(line)) return { path: 'cli', band: 'moderate' };
  if (CLI_LOW.test(line)) return { path: 'cli', band: 'low' };
  if (CLI_INFRASTRUCTURE.test(line)) return { path: 'cli', band: 'infrastructure' };
  if (DATA_ALIGNED.test(line)) return { path: 'data', band: 'aligned' };
  if (DATA_MODERATE.test(line)) return { path: 'data', band: 'moderate' };
  if (DATA_LOW.test(line)) return { path: 'data', band: 'low' };
  if (DATA_INFRASTRUCTURE.test(line)) return { path: 'data', band: 'infrastructure' };
  return null;
}

/**
 * Turns JSON-style escapes into real characters, so one line rule can read plain
 * validator output and the same output embedded in a JSON log.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\\r\\n|\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\r\n/g, '\n');
}

function fillFromLines(lines: string[], decisionIndex: number, event: AlignmentEvent): void {
  const limit = Math.min(lines.length, decisionIndex + 21);
  let listStarted = false;
  for (let j = decisionIndex + 1; j < limit; j++) {
    const line = lines[j];
    if (matchHeader(line) || matchDecision(line)) break;

    const target = TARGET_LINE.exec(line);
    if (target) {
      if (event.target === null) event.target = target[1];
      if (event.printedScore === null) event.printedScore = Number(target[2]);
      continue;
    }

    if (LIST_START.test(line)) {
      listStarted = true;
      continue;
    }

    const item = LIST_ITEM.exec(line);
    if (item && listStarted) {
      event.alternatives.push(item[1]);
      continue;
    }

    if (HARD_BLOCK.test(line)) {
      event.hardBlock = true;
      continue;
    }

    const pick = PICK_SWITCH.exec(line) ?? PICK_REQUESTED.exec(line);
    if (pick) event.pick = pick[1];
  }
}

/**
 * Scans validator output and returns one event per decision line, in text order.
 * A band comes from the decision line only, never from a printed percentage.
 */
export function scanText(text: string): AlignmentEvent[] {
  const lines = normalizeText(text).split('\n');
  const events: AlignmentEvent[] = [];
  let header: HeaderHit | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const hit = matchHeader(line);
    if (hit) {
      header = { ...hit, index: i };
      continue;
    }

    const decision = matchDecision(line);
    if (!decision) continue;

    const event: AlignmentEvent = {
      path: decision.path,
      band: decision.band,
      target: null,
      printedScore: null,
      alternatives: [],
      hardBlock: false,
      pick: null,
    };

    if (header && header.path === decision.path && i - header.index <= 8) {
      event.target = header.target;
      event.printedScore = header.score;
    }
    header = null;

    if (decision.band === 'low' || decision.band === 'infrastructure') {
      fillFromLines(lines, i, event);
    }

    events.push(event);
  }

  return events;
}

// ───────────────────────────────────────────────────────────────────
// 4. CENSUS
// ───────────────────────────────────────────────────────────────────

/** File extensions treated as source code: a save printed from one is not conversation output. */
const SOURCE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.jsx', '.py', '.sh', '.bash', '.zsh',
  '.rs', '.go', '.java', '.rb', '.c', '.h', '.cpp', '.swift', '.kt', '.php', '.lua',
]);

/** The eight decision texts as plain strings, for a fixed-string `git grep`. */
const DECISION_PHRASES = [
  'Content aligns with target folder',
  'Moderate alignment (',
  'ALIGNMENT WARNING: Content may not match',
  'INFRASTRUCTURE ALIGNMENT WARNING',
  'Good alignment with selected folder',
  'Moderate alignment - proceeding',
  'LOW ALIGNMENT WARNING',
  'INFRASTRUCTURE MISMATCH (',
];

/**
 * Lists tracked files whose text mentions a decision phrase, dropping source files so
 * the census counts conversation saves rather than the code that prints them.
 */
export function listTrackedCandidates(root: string): { files: string[]; skippedSource: number } {
  const args = ['-C', root, 'grep', '-l', '-I', '-F'];
  for (const phrase of DECISION_PHRASES) args.push('-e', phrase);
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0 && result.status !== 1) throw new Error('git grep failed');

  const files: string[] = [];
  let skippedSource = 0;
  for (const line of result.stdout.split('\n')) {
    if (line === '') continue;
    if (SOURCE_EXTENSIONS.has(path.extname(line))) {
      skippedSource += 1;
      continue;
    }
    files.push(path.join(root, line));
  }
  return { files, skippedSource };
}

/** Reads each file as UTF-8 and returns every event it holds, with the count of files read. */
export function censusFiles(files: string[]): { files: number; events: AlignmentEvent[] } {
  const events: AlignmentEvent[] = [];
  for (const file of files) {
    events.push(...scanText(readFileSync(file, 'utf8')));
  }
  return { files: files.length, events };
}

function emptyCounts(): PathCounts {
  return {
    aligned: 0,
    moderate: 0,
    low: 0,
    infrastructure: 0,
    below50: 0,
    withAlternatives: 0,
    withoutAlternatives: 0,
    hardBlocks: 0,
    picks: 0,
  };
}

/**
 * Totals events per save path: one count per band, plus below-50, alternatives,
 * hard-block and pick counts.
 */
export function summarizeEvents(events: AlignmentEvent[]): Record<SavePath, PathCounts> {
  const counts: Record<SavePath, PathCounts> = { cli: emptyCounts(), data: emptyCounts() };
  for (const event of events) {
    const pathCounts = counts[event.path];
    pathCounts[event.band] += 1;
    if (event.band === 'low' || event.band === 'infrastructure') {
      pathCounts.below50 += 1;
      if (event.alternatives.length > 0) pathCounts.withAlternatives += 1;
      else pathCounts.withoutAlternatives += 1;
    }
    if (event.hardBlock) pathCounts.hardBlocks += 1;
    if (event.pick !== null) pathCounts.picks += 1;
  }
  return counts;
}

/** Formats one count line per save path, cli first. */
export function formatPathLines(label: string, counts: Record<SavePath, PathCounts>): string[] {
  return (['cli', 'data'] as const).map((savePath) => {
    const c = counts[savePath];
    return `${label} path ${savePath}: aligned=${c.aligned} moderate=${c.moderate} low=${c.low} infrastructure=${c.infrastructure} below50=${c.below50} with_alternatives=${c.withAlternatives} without_alternatives=${c.withoutAlternatives} hard_blocks=${c.hardBlocks} picks=${c.picks}`;
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. PATH REPLAY
// ───────────────────────────────────────────────────────────────────

/** Collected-data fixture for the replay: one topic-rich request and no observations. */
const REPLAY_DATA: AlignmentCollectedData = {
  recentContext: [{ request: 'quantum lattice orchard telemetry' }],
  observations: [],
};

/**
 * Replays one validator path over a root and returns the numbered folders it saw
 * plus the decision and alternatives the validator printed, with no model call.
 */
export async function replayPath(
  path: SavePath,
  root: string,
  target: string
): Promise<{ numberedFolders: number; decision: Band | null; alternatives: string[] }> {
  let numberedFolders: number;
  try {
    numberedFolders = readdirSync(root).filter((name) => /^\d{3}-/.test(name) && !isArchiveFolder(name)).length;
  } catch {
    numberedFolders = 0;
  }

  const collected: string[] = [];
  const originalLog = console.log;
  const stdoutIsTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
  const stdinIsTTY = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');

  try {
    console.log = (...args: unknown[]) => {
      collected.push(args.map((arg) => String(arg)).join(' '));
    };
    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
    if (path === 'cli') await validateContentAlignment(REPLAY_DATA, target, root);
    else await validateFolderAlignment(REPLAY_DATA, target, root);
  } finally {
    console.log = originalLog;
    if (stdoutIsTTY === undefined) delete (process.stdout as { isTTY?: boolean }).isTTY;
    else Object.defineProperty(process.stdout, 'isTTY', stdoutIsTTY);
    if (stdinIsTTY === undefined) delete (process.stdin as { isTTY?: boolean }).isTTY;
    else Object.defineProperty(process.stdin, 'isTTY', stdinIsTTY);
  }

  const first = scanText(collected.join('\n'))[0];
  return {
    numberedFolders,
    decision: first ? first.band : null,
    alternatives: first ? first.alternatives : [],
  };
}

/**
 * Builds a throwaway tree shaped like a specs root, so the data replay lists
 * alternatives without reading the real specs. The caller removes the tree.
 */
export function buildSyntheticTree(): { root: string; target: string } {
  const root = mkdtempSync(path.join(tmpdir(), 'alignment-replay-'));
  for (const name of ['001-billing-export', '002-quantum-lattice-orchard', '003-quantum-telemetry', 'z_archive']) {
    mkdirSync(path.join(root, name));
  }
  return { root, target: '001-billing-export' };
}

// ───────────────────────────────────────────────────────────────────
// 6. TRANSCRIPTS AND ROWS
// ───────────────────────────────────────────────────────────────────

/** Transcript file extensions: JSONL records, JSON logs and captured plain output. */
const TRANSCRIPT_EXTENSIONS = new Set(['.jsonl', '.json', '.log', '.txt', '.out']);

/** The save call's summary key, one escape level deep inside a JSON payload. */
const SESSION_SUMMARY = /"sessionSummary"\s*:\s*"((?:[^"\\]|\\.)*)"/;

/** Visits every JSON object inside a parsed value, arrays included. */
function walkJsonObjects(value: unknown, visit: (record: Record<string, unknown>) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walkJsonObjects(item, visit);
    return;
  }
  if (value === null || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  visit(record);
  for (const key of Object.keys(record)) walkJsonObjects(record[key], visit);
}

/**
 * Reads the session summary a save call carried. The summary sits inside a string that
 * is itself escaped in the surrounding payload, so a miss unwraps one escape level and
 * retries, up to three levels.
 */
export function extractSessionSummary(text: string): string | null {
  let candidate = text;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) candidate = candidate.replace(/\\(["\\])/g, '$1');
    const match = SESSION_SUMMARY.exec(candidate);
    if (!match) continue;
    try {
      const value: unknown = JSON.parse(`"${match[1]}"`);
      return typeof value === 'string' && value !== '' ? value : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Scans one transcript file. Every JSON line yields the saves it holds, each paired with
 * the summary of the tool call that produced the output; a record with no tool_result is
 * scanned whole. A file with no JSON line is scanned as validator output with a null state.
 */
export function scanTranscriptFile(text: string): Array<AlignmentEvent & { state: string | null }> {
  const records: Array<{ line: string; record: unknown }> = [];
  for (const line of text.split('\n')) {
    try {
      records.push({ line, record: JSON.parse(line) as unknown });
    } catch {
      // not JSON: only the whole-text fallback below reads such a line
    }
  }
  if (records.length === 0) return scanText(text).map((event) => ({ ...event, state: null }));

  const toolUses = new Map<string, string>();
  for (const { record } of records) {
    walkJsonObjects(record, (object) => {
      if (object.type === 'tool_use' && typeof object.id === 'string' && 'input' in object) {
        toolUses.set(object.id, JSON.stringify(object.input));
      }
    });
  }

  const events: Array<AlignmentEvent & { state: string | null }> = [];
  for (const { line, record } of records) {
    const blocks: Array<{ toolUseId: string; text: string }> = [];
    walkJsonObjects(record, (object) => {
      if (object.type !== 'tool_result' || typeof object.tool_use_id !== 'string') return;
      const content = object.content;
      if (typeof content === 'string') blocks.push({ toolUseId: object.tool_use_id, text: content });
      else if (Array.isArray(content)) {
        for (const item of content) {
          if (item === null || typeof item !== 'object') continue;
          const itemText = (item as Record<string, unknown>).text;
          if (typeof itemText === 'string') blocks.push({ toolUseId: object.tool_use_id, text: itemText });
        }
      }
    });

    const found: Array<AlignmentEvent & { state: string | null }> = [];
    if (blocks.length > 0) {
      for (const block of blocks) {
        const state = extractSessionSummary(toolUses.get(block.toolUseId) ?? '');
        for (const event of scanText(block.text)) found.push({ ...event, state });
      }
    } else {
      const state = extractSessionSummary(line);
      for (const event of scanText(line)) found.push({ ...event, state });
    }

    // One output echoed into two fields is one save, so identical events count once.
    const seen = new Set<string>();
    for (const event of found) {
      const key = JSON.stringify(event);
      if (seen.has(key)) continue;
      seen.add(key);
      events.push(event);
    }
  }

  return events;
}

/** Lists the transcript files under a directory: recursive, sorted, by extension. */
export function listTranscriptFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listTranscriptFiles(full));
    else if (entry.isFile() && TRANSCRIPT_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files.sort();
}

// ───────────────────────────────────────────────────────────────────
// 7. SCORER AND GATE
// ───────────────────────────────────────────────────────────────────

/** One labeled save row: the folders a save listed plus the label to score against. */
export interface Row {
  id: string;
  path: string;
  target: string;
  alternatives: string[];
  state: string | null;
  gold: string | null;
  label: string;
}

/** True when a parsed JSON value carries every field the row shape requires. */
function isRow(value: unknown): value is Row {
  if (value === null || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.path === 'string' &&
    typeof record.target === 'string' &&
    Array.isArray(record.alternatives) &&
    record.alternatives.every((item) => typeof item === 'string') &&
    (record.state === null || typeof record.state === 'string') &&
    (record.gold === null || typeof record.gold === 'string') &&
    typeof record.label === 'string'
  );
}

/**
 * Parses a rows file: one JSON row per line, blank lines skipped. The first line
 * that fails JSON or the row shape ends the parse with its 1-based line number.
 */
export function parseRows(text: string): { rows: Row[] } | { error: string } {
  const rows: Row[] = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    let value: unknown;
    try {
      value = JSON.parse(lines[i]) as unknown;
    } catch {
      return { error: `bad row at line ${i + 1}` };
    }
    if (!isRow(value)) return { error: `bad row at line ${i + 1}` };
    rows.push(value);
  }
  return { rows };
}

/** The folder keys a row offers, target first and the none-of-these key last. */
export function rowOptions(row: Row): string[] {
  return [row.target, ...row.alternatives, NONE_KEY];
}

/** The row's label when it names an option, else its gold pick when that names one, else none. */
export function effectiveLabel(row: Row): string | null {
  const label = row.label.trim();
  if (label !== '') return label;
  if (row.gold !== null && rowOptions(row).includes(row.gold)) return row.gold;
  return null;
}

/** Ids of rows whose non-empty trimmed label names no option of that row. */
export function foreignLabelIds(rows: Row[]): string[] {
  return rows
    .filter((row) => {
      const label = row.label.trim();
      return label !== '' && !rowOptions(row).includes(label);
    })
    .map((row) => row.id);
}

/**
 * Picks the scoring baseline over the rows that carry an effective label: the target
 * answer, unless the top alternative is strictly more often right.
 */
export function chooseBaseline(rows: Row[]): { target: number; top: number; chosen: 'target' | 'top' } {
  let target = 0;
  let top = 0;
  for (const row of rows) {
    const label = effectiveLabel(row);
    if (label === null) continue;
    if (row.target === label) target += 1;
    if (row.alternatives[0] === label) top += 1;
  }
  return { target, top, chosen: top > target ? 'top' : 'target' };
}

// ───────────────────────────────────────────────────────────────────
// 8. KEEP RULE
// ───────────────────────────────────────────────────────────────────

/**
 * Upper tail P(X >= k) of a binomial with n trials and p = 0.5, summed as
 * C(n, i) * 0.5^n over i = k..n.
 */
export function binomTail(n: number, k: number): number {
  if (k <= 0) return 1;
  if (k > n) return 0;
  let tail = 0;
  for (let i = k; i <= n; i++) tail += binomialCoefficient(n, i) * 0.5 ** n;
  return tail;
}

/** C(n, k) as the multiplicative product of (n - k + j) / j for j = 1..k. */
function binomialCoefficient(n: number, k: number): number {
  let coefficient = 1;
  for (let j = 1; j <= k; j++) coefficient = (coefficient * (n - k + j)) / j;
  return coefficient;
}

/**
 * Reduces one row's passes to a single answer: the key given at least twice, `unstable`
 * when all three differ, or nothing when any pass gave no answer.
 */
export function modalPick(picks: Array<string | null>): { pick: string | null; flips: number } {
  const counts = new Map<string, number>();
  for (const pick of picks) {
    if (pick === null) return { pick: null, flips: 0 };
    counts.set(pick, (counts.get(pick) ?? 0) + 1);
  }
  for (const [key, count] of counts) {
    if (count >= 2) return { pick: key, flips: 3 - count };
  }
  return { pick: 'unstable', flips: 2 };
}

/**
 * Counts the keep rule needs: callable rows K, measured rows M, the right counts
 * A and B, the disagreements W and L, and flips F.
 */
export interface VerdictCounts {
  K: number;
  M: number;
  A: number;
  B: number;
  W: number;
  L: number;
  F: number;
}

/**
 * Counts the keep rule over the callable rows: a row is measured when all three passes
 * answered, and each measured row compares its modal pick and the baseline answer to
 * its effective label.
 */
export function countVerdict(rows: Row[], picks: Record<string, Array<string | null>>, chosen: 'target' | 'top'): VerdictCounts {
  const counts: VerdictCounts = { K: rows.length, M: 0, A: 0, B: 0, W: 0, L: 0, F: 0 };
  for (const row of rows) {
    const rowPicks = picks[row.id];
    if (rowPicks === undefined || rowPicks.length !== PASSES || rowPicks.some((pick) => pick === null)) continue;

    const { pick, flips } = modalPick(rowPicks);
    const label = effectiveLabel(row);
    const baselineAnswer = chosen === 'target' ? row.target : row.alternatives[0];
    const columnRight = pick === label;
    const baselineRight = baselineAnswer === label;

    counts.M += 1;
    counts.F += flips;
    if (columnRight) counts.A += 1;
    if (baselineRight) counts.B += 1;
    if (columnRight && !baselineRight) counts.W += 1;
    if (baselineRight && !columnRight) counts.L += 1;
  }
  return counts;
}

/**
 * Applies the keep rule in order: coverage, kill, margin, sign test, flips, keep.
 * The p value is the sign-test tail, except a kill reports its tail and coverage reports 1.
 */
export function decideVerdict(c: VerdictCounts): { verdict: string; p: number } {
  if (10 * c.M < 9 * c.K) return { verdict: 'stop (coverage)', p: 1 };

  const killP = binomTail(c.W + c.L, c.L);
  if (c.W + c.L > 0 && killP <= 0.05) return { verdict: 'kill', p: killP };

  const signP = c.W + c.L === 0 ? 1 : binomTail(c.W + c.L, c.W);
  if (10 * (c.A - c.B) < c.M) return { verdict: 'stop (margin)', p: signP };
  if (signP >= 0.05) return { verdict: 'stop (sign test)', p: signP };
  if (10 * c.F > 3 * c.M) return { verdict: 'stop (flips)', p: signP };
  return { verdict: 'keep', p: signP };
}

/**
 * One verdict line: the counts, the p value at four decimals, the baseline and the
 * backend identity.
 */
export function verdictLine(
  backend: 'jev' | 'deem',
  c: VerdictCounts,
  v: { verdict: string; p: number },
  baseline: 'target' | 'top',
  extra: string
): string {
  return `verdict ${backend}: ${v.verdict} K=${c.K} M=${c.M} A=${c.A} B=${c.B} W=${c.W} L=${c.L} F=${c.F} p=${v.p.toFixed(4)} baseline=${baseline} ${extra}`;
}

// ───────────────────────────────────────────────────────────────────
// 9. BACKEND GATES
// ───────────────────────────────────────────────────────────────────

/** First executable regular file named `name` on `env.PATH`, else null. */
function which(name: string, env: NodeJS.ProcessEnv): string | null {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir === '') continue;
    const candidate = path.join(dir, name);
    try {
      if (!statSync(candidate).isFile()) continue;
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // missing, unreadable or not executable: try the next PATH entry
    }
  }
  return null;
}

/**
 * Gates the Jev arm: the CLI must sit on PATH at the pinned version, hold a credential
 * for the provider, and the operator must have accepted sending payloads. The checks
 * carry identity only; no key, provider secret or row text is passed to them.
 */
export function jevGate(ctx: { out: (line: string) => void; env: NodeJS.ProcessEnv; acceptPayload: boolean }): { passed: boolean; path: string | null; provider: string } {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    ctx.out('jev arm skipped: jev not on PATH');
    return { passed: false, path: null, provider };
  }

  const version = spawnSync(jevPath, ['--version'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    timeout: HEALTH_TIMEOUT_MS * 5,
    env: ctx.env,
  });
  const found = (version.stdout ?? '').split('\n')[0];
  if (found !== JEV_VERSION) {
    ctx.out('jev arm skipped: version');
    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
    return { passed: false, path: jevPath, provider };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    timeout: HEALTH_TIMEOUT_MS * 5,
    env: ctx.env,
  });
  if (auth.status !== 0) {
    ctx.out('jev arm skipped: no credential');
    return { passed: false, path: jevPath, provider };
  }

  if (!ctx.acceptPayload) {
    ctx.out('jev arm skipped: payload not accepted');
    return { passed: false, path: jevPath, provider };
  }

  return { passed: true, path: jevPath, provider };
}

/** The Deem CLI to probe: the one on PATH, else the repo script under the running Node. */
export function deemCommand(env: NodeJS.ProcessEnv): string[] {
  const onPath = which('cli-deem', env);
  if (onPath !== null) return [onPath];
  return [process.execPath, path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')];
}

/**
 * Reads Deem health through its CLI: only a torch or ensemble backend on the pinned
 * model with non-empty commits counts as healthy. The probe carries no row text and
 * no credential.
 */
export function readDeemHealth(
  cmd: string[],
  env: NodeJS.ProcessEnv
): { ok: true; backend: string; model: string; modelCommit: string; sourceCommit: string } | { ok: false; reason: string; found: unknown } {
  const run = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    timeout: HEALTH_TIMEOUT_MS,
    env,
  });

  if (run.error !== undefined || run.signal !== null || run.status === 4) {
    return { ok: false, reason: 'not reachable', found: null };
  }

  const stdout = (run.stdout ?? '').trim();

  if (run.status === 3) {
    let errorText = '';
    try {
      const parsed = JSON.parse((run.stderr ?? '').trim()) as unknown;
      if (parsed !== null && typeof parsed === 'object') {
        const error = (parsed as Record<string, unknown>).error;
        if (typeof error === 'string') errorText = error;
      }
    } catch {
      // a non-JSON stderr falls through to the generic reason below
    }
    if (errorText.includes('stub')) return { ok: false, reason: 'stub backend', found: errorText };
    if (errorText.includes('refused model')) return { ok: false, reason: 'model', found: errorText };
    return { ok: false, reason: 'bad health response', found: (run.stderr ?? '').trim() };
  }

  if (run.status !== 0) {
    return { ok: false, reason: 'bad health response', found: (run.stderr ?? '').trim() };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout) as unknown;
  } catch {
    return { ok: false, reason: 'bad health response', found: stdout };
  }
  if (parsed === null || typeof parsed !== 'object') {
    return { ok: false, reason: 'bad health response', found: stdout };
  }

  const record = parsed as Record<string, unknown>;
  const backend = record.backend;
  const model = record.model;
  if (typeof backend !== 'string') return { ok: false, reason: 'bad health response', found: stdout };
  if (backend.includes('stub')) return { ok: false, reason: 'stub backend', found: backend };
  if (backend !== 'torch' && !backend.startsWith('ensemble:')) {
    return { ok: false, reason: 'bad health response', found: stdout };
  }
  if (typeof model !== 'string' || model !== DEEM_MODEL) {
    return { ok: false, reason: 'model', found: typeof model === 'string' ? model : stdout };
  }

  const modelCommit = record.model_commit;
  const sourceCommit = record.source_commit;
  if (record.ok !== true || typeof modelCommit !== 'string' || modelCommit === '' || typeof sourceCommit !== 'string' || sourceCommit === '') {
    return { ok: false, reason: 'bad health response', found: stdout };
  }

  return { ok: true, backend, model, modelCommit, sourceCommit };
}

/** Runs the Deem gate: a healthy backend prints its identity, any other answer prints why the arm is skipped. */
export function deemGate(ctx: { out: (line: string) => void; env: NodeJS.ProcessEnv }): { passed: boolean } {
  const health = readDeemHealth(deemCommand(ctx.env), ctx.env);
  if (!health.ok) {
    ctx.out(`deem arm skipped: ${health.reason}`);
    if (health.reason === 'model' || health.reason === 'bad health response') {
      ctx.out(`deem: found=${JSON.stringify(health.found)}`);
    }
    return { passed: false };
  }

  ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
  return { passed: true };
}

// ───────────────────────────────────────────────────────────────────
// 11. MAIN
// ───────────────────────────────────────────────────────────────────

/** Injected dependencies of `main`, each optional so tests replace I/O, roots and scan input. */
export interface MainDeps {
  out?: (line: string) => void;
  err?: (line: string) => void;
  env?: NodeJS.ProcessEnv;
  repoRoot?: string;
  specsRoot?: string;
  trackedFiles?: () => { files: string[]; skippedSource: number };
  describe?: (folder: string) => string;
  timeoutMs?: number;
  backoffMs?: number;
}

const MAIN_OPTIONS = {
  report: { type: 'string' },
  transcripts: { type: 'string' },
  'rows-out': { type: 'string' },
  score: { type: 'string' },
  out: { type: 'string' },
  jev: { type: 'boolean' },
  deem: { type: 'boolean' },
  'accept-payload': { type: 'boolean' },
} as const;

/**
 * Runs one census pass: every refusal first, then committed counts and the optional
 * counts report. It never spawns jev or cli-deem, so it makes no model call.
 */
export async function main(argv: string[], deps: MainDeps = {}): Promise<number> {
  const out = deps.out ?? ((line: string) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line: string) => process.stderr.write(`${line}\n`));
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const trackedFiles = deps.trackedFiles ?? (() => listTrackedCandidates(repoRoot));

  let report: string | undefined;
  let transcripts: string | undefined;
  let rowsOut: string | undefined;
  let score: string | undefined;
  let outDir: string | undefined;
  let jev = false;
  let deem = false;
  let acceptPayload = false;
  try {
    const { values } = parseArgs({ args: argv, options: MAIN_OPTIONS, strict: true, allowPositionals: false });
    report = values.report;
    transcripts = values.transcripts;
    rowsOut = values['rows-out'];
    score = values.score;
    outDir = values.out;
    jev = values.jev === true;
    deem = values.deem === true;
    acceptPayload = values['accept-payload'] === true;
  } catch (error) {
    err(`usage error: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }

  if (rowsOut !== undefined && transcripts === undefined) {
    err('--rows-out needs --transcripts <dir>');
    return 2;
  }
  if (score !== undefined && (report !== undefined || transcripts !== undefined || rowsOut !== undefined)) {
    err('--score runs alone');
    return 2;
  }
  if ((jev || deem) && score === undefined) {
    err('--jev and --deem need --score <rows file>');
    return 2;
  }
  if ((jev || deem) && outDir === undefined) {
    err('--jev and --deem need --out <dir> so every call is recorded');
    return 2;
  }

  const guardedPaths: Array<[string, string | undefined]> = [
    ['report', report],
    ['rows-out', rowsOut],
    ['out', outDir],
  ];
  for (const [flag, value] of guardedPaths) {
    if (value !== undefined && isPathInsideRoot(repoRoot, path.resolve(value))) {
      err(`refused: --${flag} path is inside the repository`);
      return 2;
    }
  }

  if (transcripts !== undefined && !existsSync(transcripts)) {
    err('transcripts path not found');
    return 2;
  }

  if (score !== undefined) {
    if (!existsSync(score)) {
      err('rows file not found');
      return 2;
    }

    const parsedRows = parseRows(readFileSync(score, 'utf8'));
    if ('error' in parsedRows) {
      err(parsedRows.error);
      return 2;
    }

    const foreign = foreignLabelIds(parsedRows.rows);
    if (foreign.length > 0) {
      err(`foreign label in rows: ${foreign.join(', ')}`);
      return 2;
    }

    const labeled = parsedRows.rows.filter((row) => effectiveLabel(row) !== null);
    const callable = labeled.filter((row) => row.state !== null && row.state !== '');
    const stateNull = parsedRows.rows.filter((row) => row.state === null).length;
    out(`rows: total=${parsedRows.rows.length} labeled=${labeled.length} callable=${callable.length} state_null=${stateNull}`);
    if (labeled.length < LABEL_GATE) {
      out(`stop: fewer than ${LABEL_GATE} labeled rows (${labeled.length} labeled)`);
      return 0;
    }
    if (callable.length < LABEL_GATE) {
      out(`stop: fewer than ${LABEL_GATE} callable rows (${callable.length} with a state)`);
      return 0;
    }

    const baseline = chooseBaseline(labeled);
    out(`baseline: target=${baseline.target} top=${baseline.top} chosen=${baseline.chosen}`);

    const right = callable.filter((row) => {
      const answer = baseline.chosen === 'target' ? row.target : row.alternatives[0];
      return answer === effectiveLabel(row);
    }).length;
    if (10 * right > 9 * callable.length) {
      out(`no headroom baseline_right=${right} K=${callable.length}`);
      return 0;
    }

    out(`margin: ${MARGIN_TEXT}`);
    out('keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M');
    out(`question: ${CHOICE_QUESTION}`);

    const env = deps.env ?? process.env;
    if (jev) jevGate({ out, env, acceptPayload });
    if (deem) deemGate({ out, env });
    return 0;
  }

  out('census source: tracked files via git grep, source code skipped');
  const tracked = trackedFiles();
  const census = censusFiles(tracked.files);
  const counts = summarizeEvents(census.events);
  out(`committed: files=${census.files} events=${census.events.length} skipped_source=${tracked.skippedSource}`);
  for (const line of formatPathLines('committed', counts)) out(line);

  const specsRoot = deps.specsRoot ?? SPECS_ROOT;
  const cliReplay = await replayPath('cli', specsRoot, '000-replay-target');
  out(`replay cli: validateContentAlignment root=specs numbered_folders=${cliReplay.numberedFolders} decision=${cliReplay.decision ?? 'none'} alternatives listed: ${cliReplay.alternatives.length}`);

  const tree = buildSyntheticTree();
  let dataReplay: { numberedFolders: number; decision: Band | null; alternatives: string[] };
  try {
    dataReplay = await replayPath('data', tree.root, tree.target);
  } finally {
    rmSync(tree.root, { recursive: true, force: true });
  }
  out(`replay data: validateFolderAlignment root=synthetic numbered_folders=${dataReplay.numberedFolders} decision=${dataReplay.decision ?? 'none'} alternatives listed: ${dataReplay.alternatives.length}`);

  let transcriptReport: {
    files: number;
    events: number;
    paths: Record<SavePath, PathCounts>;
    rowsWritten: number | null;
    stateNull: number | null;
  } | null = null;

  if (transcripts !== undefined) {
    const transcriptFiles = listTranscriptFiles(transcripts);
    const transcriptEvents: Array<AlignmentEvent & { state: string | null }> = [];
    for (const file of transcriptFiles) transcriptEvents.push(...scanTranscriptFile(readFileSync(file, 'utf8')));
    const transcriptCounts = summarizeEvents(transcriptEvents);
    out(`transcripts: files=${transcriptFiles.length} events=${transcriptEvents.length}`);
    for (const line of formatPathLines('transcripts', transcriptCounts)) out(line);

    let rowsWritten: number | null = null;
    let stateNull: number | null = null;
    if (rowsOut !== undefined) {
      const rows = transcriptEvents
        .filter((event) => (event.band === 'low' || event.band === 'infrastructure') && event.alternatives.length > 0)
        .map((event, index) => {
          const pick = event.pick;
          const gold = pick !== null && (pick === event.target || event.alternatives.includes(pick)) ? pick : null;
          return {
            id: `row-${String(index + 1).padStart(4, '0')}`,
            path: event.path,
            target: event.target,
            alternatives: event.alternatives,
            state: event.state,
            gold,
            label: '',
          };
        });
      mkdirSync(path.dirname(rowsOut), { recursive: true });
      const rowLines = rows.map((row) => JSON.stringify(row));
      writeFileSync(rowsOut, rowLines.length > 0 ? `${rowLines.join('\n')}\n` : '');
      rowsWritten = rows.length;
      stateNull = rows.filter((row) => row.state === null).length;
      out(`rows written: ${rowsWritten} state_null=${stateNull}`);
    }

    transcriptReport = {
      files: transcriptFiles.length,
      events: transcriptEvents.length,
      paths: transcriptCounts,
      rowsWritten,
      stateNull,
    };
  } else {
    out('transcript events: not measured');
  }

  if (report !== undefined) {
    mkdirSync(report, { recursive: true });
    const payload = {
      committed: {
        files: census.files,
        events: census.events.length,
        skippedSource: tracked.skippedSource,
        paths: counts,
      },
      replay: [
        {
          path: 'cli',
          fn: 'validateContentAlignment',
          root: 'specs',
          numberedFolders: cliReplay.numberedFolders,
          decision: cliReplay.decision,
          alternativesListed: cliReplay.alternatives.length,
        },
        {
          path: 'data',
          fn: 'validateFolderAlignment',
          root: 'synthetic',
          numberedFolders: dataReplay.numberedFolders,
          decision: dataReplay.decision,
          alternativesListed: dataReplay.alternatives.length,
        },
      ],
      transcripts: transcriptReport,
    };
    writeFileSync(path.join(report, 'report.json'), `${JSON.stringify(payload, null, 2)}\n`);
  }

  return 0;
}

if (isMainModule(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
