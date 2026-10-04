// ───────────────────────────────────────────────────────────────────
// MODULE: Alignment Suggestion Measurement
// ───────────────────────────────────────────────────────────────────
//
// Counts below-50 alignment saves per save path and replays both validator paths,
// with zero model calls. Past a 30-row label gate, an opt-in Jev column picks
// one of the folders a save listed. The script holds no credential and reads none.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { accessSync, appendFileSync, constants, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';
import { isArchiveFolder, validateContentAlignment, validateFolderAlignment, type AlignmentCollectedData } from '../spec-folder/alignment-validator.js';
import { isPathInsideRoot } from '../utils/path-utils.js';
import type { Dirent } from 'node:fs';

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
  savePath: SavePath,
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
    if (savePath === 'cli') await validateContentAlignment(REPLAY_DATA, target, root);
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

/** The shared report pieces the classifier scorers export, typed as this scorer calls them. */
interface ScorerReport {
  pinRowSet(rows: Array<Record<string, unknown>>): { rowSetSha256: string; rowCount: number; rows: Array<Record<string, unknown>> };
  outDirectoryHoldsRun(outDir: string | undefined): boolean;
  probabilityAwarePick(votes: Array<{ pick: string | null; pickProb: number | null }>, noneKey: string | null): string | null;
  decidedSubset(pairs: Array<{ pick: string | null; gold: string | null }>, noneKey: string | null): { decidedCount: number; decidedCorrect: number; decidedAccuracy: number | null };
  marginSlack(tally: { A: number; B: number; M: number }): number | null;
  clusterBootstrapInterval(items: Array<{ cluster: string; delta: number }>, seedText: string): { clusterCount: number; replicates: number; estimate: number | null; lower: number | null; upper: number | null };
  decidedSubsetLine(name: string, subset: { decidedCount: number; decidedCorrect: number; decidedAccuracy: number | null }): string;
  marginSlackLine(name: string, slack: number | null): string;
  bootstrapLine(name: string, bootstrap: { clusterCount: number; replicates: number; lower: number | null; upper: number | null }): string;
}

// Loaded at run time because the shared module belongs to another skill, outside this package's compile root.
async function loadScorerReport(): Promise<ScorerReport> {
  return (await import(
    pathToFileURL(path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'shared', 'scripts', 'scorer-report.mjs')).href
  )) as ScorerReport;
}

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

/** Separate counters keep path-specific candidate misses visible in the summary. */
export interface CandidateRecall {
  content: { offered: number; labeled: number };
  folder: { offered: number; labeled: number };
  other: { offered: number; labeled: number };
  overall: { offered: number; labeled: number };
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

/** Separates candidate misses before scoring, since a chooser cannot recover an unoffered folder. */
export function summarizeCandidateRecall(rows: Row[]): CandidateRecall {
  const recall: CandidateRecall = {
    content: { offered: 0, labeled: 0 },
    folder: { offered: 0, labeled: 0 },
    other: { offered: 0, labeled: 0 },
    overall: { offered: 0, labeled: 0 },
  };
  for (const row of rows) {
    const label = effectiveLabel(row);
    if (label === null || label === NONE_KEY) continue;
    const category = row.path === 'cli' ? recall.content : row.path === 'data' ? recall.folder : recall.other;
    const offered = row.target === label || row.alternatives.includes(label);
    category.labeled += 1;
    recall.overall.labeled += 1;
    if (offered) {
      category.offered += 1;
      recall.overall.offered += 1;
    }
  }
  return recall;
}

/** Marks an empty sample as n/a because a zero denominator has no recall rate. */
function formatRecall(recall: { offered: number; labeled: number }): string {
  const rate = recall.labeled === 0 ? 'n/a' : `${((100 * recall.offered) / recall.labeled).toFixed(1)}%`;
  return `${recall.offered}/${recall.labeled} (${rate})`;
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

/** Preserves differing rows for review because W+L alone hides which labels disagree. */
export interface DiscordantRow {
  rowId: string;
  label: string;
  comparatorPick: string;
  modelPick: string;
  outcome: 'win' | 'loss';
}

/** Keeps uncertainty tied to the discordant rows that determine the win-rate sign test. */
export interface ConfidenceInterval {
  lower: number;
  upper: number;
}

/**
 * Counts three answers, or one exact-confidence answer, so the gated arm can measure a
 * row without paying for two redundant passes.
 */
export function countVerdict(
  rows: Row[],
  picks: Record<string, Array<string | null>>,
  chosen: 'target' | 'top',
  confidenceGated = false
): VerdictCounts {
  const counts: VerdictCounts = { K: rows.length, M: 0, A: 0, B: 0, W: 0, L: 0, F: 0 };
  for (const row of rows) {
    const rowPicks = picks[row.id];
    if (rowPicks === undefined || rowPicks.some((pick) => pick === null)) continue;
    const singleCertainPass = confidenceGated && rowPicks.length === 1;
    if (!singleCertainPass && rowPicks.length !== PASSES) continue;

    const { pick, flips } = singleCertainPass ? { pick: rowPicks[0], flips: 0 } : modalPick(rowPicks);
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

/** Uses a Wilson interval because a small discordant sample is not an exact win rate. */
export function wilsonInterval(wins: number, total: number): ConfidenceInterval {
  if (total === 0) return { lower: 0, upper: 1 };
  const z = 1.96;
  const rate = wins / total;
  const zSquared = z * z;
  const denominator = 1 + zSquared / total;
  const center = (rate + zSquared / (2 * total)) / denominator;
  const margin = (z * Math.sqrt((rate * (1 - rate)) / total + zSquared / (4 * total * total))) / denominator;
  return { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) };
}

/** Exposes the differing labels that an aggregate W+L count cannot identify. */
function listDiscordantRows(
  rows: Row[],
  picks: Record<string, Array<string | null>>,
  chosen: 'target' | 'top',
  confidenceGated = false
): DiscordantRow[] {
  const discordant: DiscordantRow[] = [];
  for (const row of rows) {
    const rowPicks = picks[row.id];
    if (rowPicks === undefined || rowPicks.some((pick) => pick === null)) continue;
    const singleCertainPass = confidenceGated && rowPicks.length === 1;
    if (!singleCertainPass && rowPicks.length !== PASSES) continue;
    const modelPick = singleCertainPass ? rowPicks[0] : modalPick(rowPicks).pick;
    const label = effectiveLabel(row);
    if (modelPick === null || modelPick === undefined || label === null) continue;
    const comparatorPick = chosen === 'target' ? row.target : row.alternatives[0];
    const modelRight = modelPick === label;
    const comparatorRight = comparatorPick === label;
    if (modelRight === comparatorRight) continue;
    discordant.push({
      rowId: row.id,
      label,
      comparatorPick,
      modelPick,
      outcome: modelRight ? 'win' : 'loss',
    });
  }
  return discordant;
}

type ArmMetrics = {
  verdict: string;
  counts: VerdictCounts;
  p: number;
  discordantRows: DiscordantRow[];
  interval: ConfidenceInterval;
};

/** Reuses saved picks so the swapped-label control does not make extra model calls. */
function scorePicks(
  rows: Row[],
  picks: Record<string, Array<string | null>>,
  chosen: 'target' | 'top',
  confidenceGated = false
): ArmMetrics {
  const counts = countVerdict(rows, picks, chosen, confidenceGated);
  const decided = decideVerdict(counts);
  return {
    verdict: decided.verdict,
    counts,
    p: decided.p,
    discordantRows: listDiscordantRows(rows, picks, chosen, confidenceGated),
    interval: wilsonInterval(counts.W, counts.W + counts.L),
  };
}

/** The probability-aware arm's counts, verdict line and the report pieces that accompany it. */
interface ProbabilityAwareAnalysis {
  probabilityAware: VerdictCounts & {
    verdict: string;
    p: number;
    line: string;
    decidedCount: number;
    decidedCorrect: number;
    decidedAccuracy: number | null;
    marginSlack: number | null;
  };
  bootstrap: {
    clusterCount: number;
    replicates: number;
    estimate: number | null;
    lower: number | null;
    upper: number | null;
  };
}

/**
 * Scores the probability-aware arm from saved picks: each row's pick is the key its
 * passes gave the highest summed probability, with every pass's none probability
 * added to the none key, counted by the same measured-row rule as the gated column
 * and reported against the baseline it is compared with.
 */
export function scoreProbabilityArm(
  scorerReport: ScorerReport,
  rows: Row[],
  picks: Record<string, Array<string | null>>,
  pickProbs: Record<string, Array<number | null>>,
  noneProbs: Record<string, Array<number | null>>,
  chosen: 'target' | 'top'
): ProbabilityAwareAnalysis {
  const counts: VerdictCounts = { K: rows.length, M: 0, A: 0, B: 0, W: 0, L: 0, F: 0 };
  const pairs: Array<{ pick: string | null; gold: string | null }> = [];
  const items: Array<{ cluster: string; delta: number }> = [];
  const probabilityPicks = new Map<string, string | null>();

  for (const row of rows) {
    const rowPicks = picks[row.id];
    if (rowPicks === undefined || rowPicks.some((pick) => pick === null) || rowPicks.length !== PASSES) {
      probabilityPicks.set(row.id, null);
      continue;
    }

    const pick = scorerReport.probabilityAwarePick(
      rowPicks.map((rowPick, index) => ({
        pick: rowPick,
        pickProb: pickProbs[row.id]?.[index] ?? null,
        noneProb: noneProbs[row.id]?.[index] ?? null,
      })),
      NONE_KEY
    );
    if (pick === null) {
      probabilityPicks.set(row.id, null);
      continue;
    }
    probabilityPicks.set(row.id, pick);

    const { flips } = modalPick(rowPicks);
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
    pairs.push({ pick, gold: label });
    items.push({ cluster: row.target, delta: Number(columnRight) - Number(baselineRight) });
  }

  const decided = decideVerdict(counts);
  const line = verdictLine('probability-aware', counts, decided, chosen, '');
  const subset = scorerReport.decidedSubset(pairs, NONE_KEY);
  const slack = scorerReport.marginSlack(counts);
  const seedText = rows.map((row) => `${row.id}\u0000${probabilityPicks.get(row.id) ?? ''}`).join('\n');
  const bootstrap = scorerReport.clusterBootstrapInterval(items, seedText);
  return {
    probabilityAware: { ...counts, verdict: decided.verdict, p: decided.p, line, ...subset, marginSlack: slack },
    bootstrap,
  };
}

/** Reuses the choices to check whether evaluation changes when target and top labels swap. */
function swapTargetTopLabels(rows: Row[]): Row[] {
  return rows.map((row) => {
    const label = effectiveLabel(row);
    const top = row.alternatives[0];
    if (label === null || top === undefined) return row;
    if (label === row.target) return { ...row, label: top, gold: null };
    if (label === top) return { ...row, label: row.target, gold: null };
    return { ...row, label, gold: null };
  });
}

/** Rotates states to expose choices that depend on matching row context. */
function distractorStates(rows: Row[]): Row[] {
  return rows.map((row, index) => ({
    ...row,
    state: rows.length > 1 ? rows[(index + 1) % rows.length].state : 'Unrelated context',
  }));
}

/**
 * One verdict line: the counts, the p value at four decimals, the baseline and the
 * backend identity.
 */
export function verdictLine(
  backend: 'jev' | 'probability-aware',
  c: VerdictCounts,
  v: { verdict: string; p: number },
  baseline: 'target' | 'top',
  extra: string
): string {
  const suffix = extra === '' ? '' : ` ${extra}`;
  return `verdict ${backend}: ${v.verdict} K=${c.K} M=${c.M} A=${c.A} B=${c.B} W=${c.W} L=${c.L} F=${c.F} p=${v.p.toFixed(4)} baseline=${baseline}${suffix}`;
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

// ───────────────────────────────────────────────────────────────────
// 10. MODEL ARMS
// ───────────────────────────────────────────────────────────────────

/** One backend call: its streams, exit code, wall time and whether the timeout killed it. */
interface CallResult {
  stdout: string;
  stderr: string;
  code: number;
  wallMs: number;
  timedOut: boolean;
}

/** One calls.jsonl line: what a call was and what it returned, never the row state. */
interface CallRecord {
  backend: 'jev';
  arm: string;
  row_id: string | null;
  order: number | null;
  wall_ms: number;
  exit_code: number;
  pick: string | null;
  pick_prob: number | null;
  status: string;
  options_hash: string | null;
  model?: string | null;
  model_commit?: string | null;
  source_commit?: string | null;
  jev_version?: string;
  provider?: string;
}

/** One call's classification: the measured pick and probabilities, or a null pick with why it was not measured. */
interface Classification {
  pick: string | null;
  pickProb: number | null;
  noneProb: number | null;
  status: string;
}

/** One call step's outcome for the row loop: the measured pick, or the stop that ended the arm. */
type StepOutcome = { pick: string | null; probability: number | null; noneProbability: number | null } | { stop: string };

/** One arm run's outcome: its verdict line, or the stop line with the rows finished before it. */
type ArmOutcome =
  | {
      line: string;
      verdict: string;
      counts: VerdictCounts;
      p: number;
      picks: Record<string, Array<string | null>>;
      pickProbs: Record<string, Array<number | null>>;
      noneProbs: Record<string, Array<number | null>>;
      discordantRows: DiscordantRow[];
      interval: ConfidenceInterval;
      choiceCalls: number;
    }
  | { stopped: string; partialRows: number; choiceCalls: number };

/** The classification of a call that produced no usable pick. */
const UNMEASURED: Classification = { pick: null, pickProb: null, noneProb: null, status: 'unmeasured' };

/** Directory entries of `dir`, or none when it cannot be read. */
function readEntries(dir: string): Dirent[] {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

/**
 * The `description.json` for a bare option name under the row's own packet parent. Resolving
 * against the row's track keeps a colliding basename from collapsing to the folder name when the
 * same name also lives in another track.
 */
/** Resolves a folder key to its description text; rowPath and target carry the row's context. */
export type Describer = (folder: string, rowPath?: string, target?: string) => string;

/**
 * The file path whose grandparent directory is the row's parent folder, used to resolve
 * bare option names as siblings. A labeled row stores a repository file path, used as is.
 * A census row stores only its save category in `path`, so the row's target name is looked
 * up through the folder index; only a unique hit supplies the parent, and everything else
 * keeps the row's fallback.
 */
function siblingAnchorFor(
  rowPath: string | undefined,
  target: string | undefined,
  indexByName: () => Map<string, string[]>
): string | null {
  if (rowPath === undefined) return null;
  if (rowPath.includes('/') || rowPath.includes(path.sep)) return rowPath;
  if (target === undefined || target.includes('/') || target.includes(path.sep)) return null;
  const dirs = indexByName().get(target) ?? [];
  if (dirs.length !== 1) return null;
  return path.join(dirs[0], 'description.json');
}

function siblingDescriptionFile(specsRoot: string, rowPath: string, folder: string): string | null {
  const normalized = rowPath.split(/[\\/]/).join(path.sep);
  const packetParent = path.dirname(path.dirname(normalized));
  if (packetParent === '' || packetParent === '.') return null;
  const candidates = [
    path.resolve(specsRoot, packetParent, folder),
    path.resolve(path.dirname(specsRoot), packetParent, folder),
  ];
  for (const candidate of candidates) {
    if (!isPathInsideRoot(specsRoot, candidate)) continue;
    const file = path.join(candidate, 'description.json');
    if (existsSync(file)) return file;
  }
  return null;
}

/**
 * Resolves explicit folder paths first because basenames can collide across tracks. The
 * basename index excludes archives so retired descriptions cannot make live names ambiguous.
 */
export function buildDescriber(specsRoot: string): Describer {
  let byName: Map<string, string[]> | null = null;

  const indexByName = (): Map<string, string[]> => {
    if (byName !== null) return byName;
    const index = new Map<string, string[]>();
    const walk = (dir: string): void => {
      if (isArchiveFolder(path.basename(dir))) return;
      const entries = readEntries(dir);
      if (entries.some((entry) => entry.isFile() && entry.name === 'description.json')) {
        const name = path.basename(dir);
        index.set(name, [...(index.get(name) ?? []), dir]);
      }
      for (const entry of entries) {
        if (entry.isDirectory()) walk(path.join(dir, entry.name));
      }
    };
    walk(specsRoot);
    byName = index;
    return index;
  };

  return (folder: string, rowPath?: string, target?: string): string => {
    let file: string | null = null;
    if (folder.includes('/') || folder.includes(path.sep)) {
      const folderPath = path.resolve(specsRoot, folder);
      if (isPathInsideRoot(specsRoot, folderPath)) file = path.join(folderPath, 'description.json');
    } else {
      const anchor = siblingAnchorFor(rowPath, target, indexByName);
      if (anchor !== null) file = siblingDescriptionFile(specsRoot, anchor, folder);
      if (file === null) {
        const dirs = indexByName().get(folder) ?? [];
        if (dirs.length === 1) file = path.join(dirs[0], 'description.json');
      }
    }
    if (file !== null) {
      try {
        const parsed = JSON.parse(readFileSync(file, 'utf8')) as unknown;
        if (parsed !== null && typeof parsed === 'object') {
          const description = (parsed as Record<string, unknown>).description;
          if (typeof description === 'string') return description;
        }
      } catch {
        // Unreadable or unparseable file: fall back to the folder name
      }
    }
    return folder;
  };
}

/**
 * Runs one backend call and resolves with its streams, exit code, wall time and whether
 * the timeout killed it. A signal death reads as -1 and a spawn error as 127, so every
 * call still leaves a record.
 */
function spawnCall(
  file: string,
  args: string[],
  stdinText: string,
  env: NodeJS.ProcessEnv,
  timeoutMs: number
): Promise<CallResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(file, args, { stdio: ['pipe', 'pipe', 'pipe'], env });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;
    let timer: NodeJS.Timeout | undefined;

    const settle = (code: number): void => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      resolve({ stdout, stderr, code, wallMs: Date.now() - started, timedOut });
    };

    timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    child.on('error', () => settle(127));
    child.on('close', (code, signal) => settle(code ?? (signal !== null ? -1 : 127)));
    child.stdin.on('error', () => {
      // The child may exit before its input is written; the exit code carries the outcome
    });
    child.stdin.end(stdinText);
  });
}

/** Appends one call record to `<outDir>/calls.jsonl`, the run's audit trail. */
function writeCall(outDir: string, record: CallRecord): void {
  mkdirSync(outDir, { recursive: true });
  appendFileSync(path.join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`);
}

/** Ties a run to the exact input and report bytes used for its comparison. */
function sha256(contents: Buffer | string): string {
  return createHash('sha256').update(contents).digest('hex');
}

/** Parses stdout as JSON, or null when it is not JSON. */
function tryJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Reads `answers.answer.choice` and its probability from a call's stdout JSON, plus the
 * probability the same answer gave the none key. The probability-aware pick needs the
 * none probability even when the pick named a real folder, so it cannot be derived from
 * the chosen option's probability alone.
 */
function readAnswer(parsed: unknown): { choice: string | null; probability: number | null; noneProbability: number | null } {
  if (parsed === null || typeof parsed !== 'object') return { choice: null, probability: null, noneProbability: null };
  const answers = (parsed as Record<string, unknown>).answers;
  if (answers === null || typeof answers !== 'object') return { choice: null, probability: null, noneProbability: null };
  const answer = (answers as Record<string, unknown>).answer;
  if (answer === null || typeof answer !== 'object') return { choice: null, probability: null, noneProbability: null };
  const record = answer as Record<string, unknown>;
  if (typeof record.choice !== 'string') return { choice: null, probability: null, noneProbability: null };

  let probability: number | null = null;
  let noneProbability: number | null = null;
  const probabilities = record.probabilities;
  if (probabilities !== null && typeof probabilities === 'object') {
    const value = (probabilities as Record<string, unknown>)[record.choice];
    if (typeof value === 'number') probability = value;
    const noneValue = (probabilities as Record<string, unknown>)[NONE_KEY];
    if (typeof noneValue === 'number') noneProbability = noneValue;
  }
  return { choice: record.choice, probability, noneProbability };
}

/** Classifies one call: only a 0 whose stdout names one of the row's keys is measured. */
function classifyCall(result: CallResult, keys: string[]): Classification {
  if (result.timedOut) return { pick: null, pickProb: null, noneProb: null, status: 'unmeasured_timeout' };
  if (result.code !== 0) return UNMEASURED;

  const answer = readAnswer(tryJson(result.stdout));
  if (answer.choice === null || !keys.includes(answer.choice)) return UNMEASURED;
  return { pick: answer.choice, pickProb: answer.probability, noneProb: answer.noneProbability, status: 'measured' };
}

/** Waits `ms` before a retry. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** The `key=text` option lines of one row, with a shared text disambiguated by its key. */
function buildOptionLines(row: Row, describe: Describer): string[] {
  const keys = rowOptions(row);
  const texts = keys.map((key) => (key === NONE_KEY ? NONE_DESCRIPTION : describe(key, row.path, row.target)));
  const shared = new Map<string, number>();
  for (const text of texts) shared.set(text, (shared.get(text) ?? 0) + 1);
  return keys.map((key, index) => {
    const text = texts[index];
    return `${key}=${(shared.get(text) ?? 0) > 1 ? `${text} [${key}]` : text}`;
  });
}

/**
 * Runs one arm over the callable rows: one call per pass with the options rotated, every
 * call recorded under `<outDir>/calls.jsonl`, then the keep rule over the picks. A stop
 * line ends the arm with the rows finished so far, and no verdict.
 */
export async function runArm(
  backend: 'jev',
  rows: Row[],
  chosen: 'target' | 'top',
  gate: { cmd: string[]; provider?: string; model?: string; modelCommit?: string; sourceCommit?: string },
  ctx: {
    out: (line: string) => void;
    env: NodeJS.ProcessEnv;
    timeoutMs: number;
    backoffMs: number;
    outDir: string;
    describe: Describer;
  },
  options: { name?: string; confidenceGated?: boolean } = {}
): Promise<ArmOutcome> {
  const provider = gate.provider ?? 'official';
  const armName = options.name ?? backend;
  const confidenceGated = options.confidenceGated ?? false;
  const optionLines = rows.map((row) => buildOptionLines(row, ctx.describe));

  if (backend === 'jev') {
    const perRow = rows.reduce(
      (sum, row, index) =>
        sum + (row.state ?? '').length + CHOICE_QUESTION.length + optionLines[index].reduce((lineSum, line) => lineSum + line.length, 0),
      0
    );
    ctx.out(`${armName}: payload=operator session summaries and folder descriptions planned_calls=${3 * rows.length + 1} est_input_tokens=${Math.ceil((3 * perRow) / 4)}`);
  }

  let jevModel = 'unknown';
  if (backend === 'jev') {
    const auth = await spawnCall(
      gate.cmd[0],
      [...gate.cmd.slice(1), 'auth', 'test', '--provider', provider],
      '',
      ctx.env,
      ctx.timeoutMs
    );
    if (auth.code === 0) {
      const parsed = tryJson(auth.stdout);
      if (parsed !== null && typeof parsed === 'object') {
        const model = (parsed as Record<string, unknown>).model;
        if (typeof model === 'string') jevModel = model;
      }
    }
    writeCall(ctx.outDir, {
      backend,
      arm: armName,
      row_id: null,
      order: null,
      wall_ms: auth.wallMs,
      exit_code: auth.code,
      pick: null,
      pick_prob: null,
      status: 'auth',
      options_hash: null,
      jev_version: JEV_VERSION,
      provider,
      model: jevModel,
    });
    if (auth.code !== 0) {
      const stopped = auth.code === 3 ? 'jev arm stopped: key rejected' : 'jev arm stopped: auth test failed';
      ctx.out(stopped);
      ctx.out(`${armName}: partial_rows=0`);
      return { stopped, partialRows: 0, choiceCalls: 0 };
    }
  }

  let choiceCalls = 0;
  const callRecord = (
    row: Row,
    order: number,
    result: CallResult,
    step: Classification,
    optionsHash: string
  ): CallRecord => {
    const base = {
      backend,
      arm: armName,
      row_id: row.id,
      order,
      wall_ms: result.wallMs,
      exit_code: result.code,
      pick: step.pick,
      pick_prob: step.pickProb,
      status: step.status,
      options_hash: optionsHash,
    };
    return { ...base, jev_version: JEV_VERSION, provider, model: jevModel };
  };

  const callArgs = (order: number, lines: string[]): string[] => {
    const rotated = lines.map((_, index) => lines[(index + order) % lines.length]);
    const args = ['choice'];
    if (backend === 'jev') args.push('--provider', provider);
    args.push('-q', CHOICE_QUESTION);
    for (const line of rotated) args.push('-o', line);
    return args;
  };

  const runStep = async (
    row: Row,
    order: number,
    args: string[],
    optionsHash: string,
    keys: string[]
  ): Promise<StepOutcome> => {
    const attempt = (): Promise<CallResult> => {
      choiceCalls += 1;
      return spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], row.state ?? '', ctx.env, ctx.timeoutMs);
    };
    let result = await attempt();

    if (result.code === 4) {
      await sleep(ctx.backoffMs);
      result = await attempt();
    }

    const step = classifyCall(result, keys);
    writeCall(ctx.outDir, callRecord(row, order, result, step, optionsHash));

    if (result.code === 2) return { stop: `${backend} arm stopped: usage error` };
    if (result.code === 3) return { stop: 'jev arm stopped: key rejected' };
    if (result.code === 130) return { stop: `${backend} arm stopped: interrupted` };
    return { pick: step.pick, probability: step.pickProb, noneProbability: step.noneProb };
  };

  const picks: Record<string, Array<string | null>> = {};
  const pickProbs: Record<string, Array<number | null>> = {};
  const noneProbs: Record<string, Array<number | null>> = {};
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const lines = optionLines[rowIndex];
    const optionsHash = createHash('sha256').update(lines.join('\n')).digest('hex').slice(0, 16);
    const keys = rowOptions(row);
    const rowPicks: Array<string | null> = [];
    const rowProbs: Array<number | null> = [];
    const rowNoneProbs: Array<number | null> = [];

    for (let order = 0; order < PASSES; order++) {
      const step = await runStep(row, order, callArgs(order, lines), optionsHash, keys);
      if ('stop' in step) {
        ctx.out(step.stop);
        ctx.out(`${armName}: partial_rows=${rowIndex}`);
        return { stopped: step.stop, partialRows: rowIndex, choiceCalls };
      }
      rowPicks.push(step.pick);
      rowProbs.push(step.probability);
      rowNoneProbs.push(step.noneProbability);
      if (confidenceGated && order === 0 && step.probability === 1) break;
    }
    picks[row.id] = rowPicks;
    pickProbs[row.id] = rowProbs;
    noneProbs[row.id] = rowNoneProbs;
  }

  const counts = countVerdict(rows, picks, chosen, confidenceGated);
  const decided = decideVerdict(counts);
  const extra = `jev_version=${JEV_VERSION} provider=${provider} model=${jevModel}`;
  const line = verdictLine(backend, counts, decided, chosen, extra);
  const discordantRows = listDiscordantRows(rows, picks, chosen, confidenceGated);
  const interval = wilsonInterval(counts.W, counts.W + counts.L);
  ctx.out(line);
  ctx.out(`${armName}: W+L=${counts.W + counts.L} interval95=[${interval.lower.toFixed(3)},${interval.upper.toFixed(3)}]`);
  ctx.out(`${armName}: discordant_rows=${discordantRows.length}`);
  for (const discordant of discordantRows) {
    ctx.out(`${armName}: discordant row_id=${discordant.rowId} outcome=${discordant.outcome} label=${discordant.label} comparator=${discordant.comparatorPick} model=${discordant.modelPick}`);
  }
  if (confidenceGated) ctx.out(`${armName}: choice_calls=${choiceCalls} full_pass_calls=${rows.length * PASSES} saved=${rows.length * PASSES - choiceCalls}`);
  return { line, verdict: decided.verdict, counts, p: decided.p, picks, pickProbs, noneProbs, discordantRows, interval, choiceCalls };
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
  describe?: Describer;
  timeoutMs?: number;
  backoffMs?: number;
}

const MAIN_OPTIONS = {
  report: { type: 'string' },
  transcripts: { type: 'string' },
  'rows-out': { type: 'string' },
  score: { type: 'string' },
  baseline: { type: 'string' },
  out: { type: 'string' },
  jev: { type: 'boolean' },
  'accept-payload': { type: 'boolean' },
} as const;

/**
 * Runs one census pass: every refusal first, then committed counts and the optional
 * counts report. It never spawns jev, so it makes no model call.
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
  let baselineArgument: string | undefined;
  let outDir: string | undefined;
  let jev = false;
  let acceptPayload = false;
  try {
    const { values } = parseArgs({ args: argv, options: MAIN_OPTIONS, strict: true, allowPositionals: false });
    report = values.report;
    transcripts = values.transcripts;
    rowsOut = values['rows-out'];
    score = values.score;
    baselineArgument = values.baseline;
    outDir = values.out;
    jev = values.jev === true;
    acceptPayload = values['accept-payload'] === true;
  } catch (error) {
    err(`usage error: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }

  if (baselineArgument !== undefined && baselineArgument !== 'target' && baselineArgument !== 'top') {
    err('--baseline must be target or top');
    return 2;
  }
  if (baselineArgument !== undefined && score === undefined) {
    err('--baseline needs --score <rows file>');
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
  if (jev && score === undefined) {
    err('--jev needs --score <rows file>');
    return 2;
  }
  if (jev && outDir === undefined) {
    err('--jev needs --out <dir> so every call is recorded');
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

  const scorerReport = jev ? await loadScorerReport() : null;
  if (scorerReport !== null && scorerReport.outDirectoryHoldsRun(outDir)) {
    err('--out directory already holds a run');
    return 2;
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

    const rowsBytes = readFileSync(score);
    const parsedRows = parseRows(rowsBytes.toString('utf8'));
    if ('error' in parsedRows) {
      err(parsedRows.error);
      return 2;
    }

    const labeled = parsedRows.rows.filter((row) => effectiveLabel(row) !== null);
    const callable = labeled.filter((row) => row.state !== null && row.state !== '');
    const stateNull = parsedRows.rows.filter((row) => row.state === null).length;
    const contentSaves = parsedRows.rows.filter((row) => row.path === 'cli').length;
    const folderSaves = parsedRows.rows.filter((row) => row.path === 'data').length;
    const otherSaves = parsedRows.rows.length - contentSaves - folderSaves;
    const candidateRecall = summarizeCandidateRecall(parsedRows.rows);
    out(`rows: total=${parsedRows.rows.length} labeled=${labeled.length} callable=${callable.length} state_null=${stateNull}`);
    out(`save path split: content=${contentSaves} folder=${folderSaves} other=${otherSaves}`);
    out(`candidate recall: content=${formatRecall(candidateRecall.content)} folder=${formatRecall(candidateRecall.folder)} overall=${formatRecall(candidateRecall.overall)}`);
    if (labeled.length < LABEL_GATE) {
      out(`stop: fewer than ${LABEL_GATE} labeled rows (${labeled.length} labeled)`);
      return 0;
    }
    if (callable.length < LABEL_GATE) {
      out(`stop: fewer than ${LABEL_GATE} callable rows (${callable.length} with a state)`);
      return 0;
    }

    const automaticBaseline = chooseBaseline(labeled);
    const declaredComparator = baselineArgument === 'target' || baselineArgument === 'top' ? baselineArgument : null;
    const baseline = {
      ...automaticBaseline,
      chosen: declaredComparator ?? automaticBaseline.chosen,
      comparator: declaredComparator === null ? 'auto' : 'declared',
    };
    out(`baseline: target=${baseline.target} top=${baseline.top} chosen=${baseline.chosen} comparator=${baseline.comparator}`);

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
    const columns: {
      jev?: ArmOutcome;
      confidenceGated?: ArmOutcome;
      negativeControls?: { labelSwap: ArmMetrics; distractorState?: ArmOutcome };
    } = {};
    let analysis: ProbabilityAwareAnalysis | null = null;
    const armCtx = {
      out,
      env,
      timeoutMs: deps.timeoutMs ?? CALL_TIMEOUT_MS,
      backoffMs: deps.backoffMs ?? BACKOFF_MS,
      outDir: outDir ?? '',
      describe: deps.describe ?? buildDescriber(deps.specsRoot ?? SPECS_ROOT),
    };

    const jevGateResult = jev ? jevGate({ out, env, acceptPayload }) : null;
    if (jevGateResult !== null && jevGateResult.passed && jevGateResult.path !== null) {
      const gate = { cmd: [jevGateResult.path], provider: jevGateResult.provider };
      const primary = await runArm(
        'jev',
        callable,
        baseline.chosen,
        gate,
        armCtx
      );
      columns.jev = primary;
      if ('picks' in primary) {
        const labelSwap = scorePicks(swapTargetTopLabels(callable), primary.picks, baseline.chosen);
        columns.negativeControls = { labelSwap };
        out(`negative control label-swap: W+L=${labelSwap.counts.W + labelSwap.counts.L} interval95=[${labelSwap.interval.lower.toFixed(3)},${labelSwap.interval.upper.toFixed(3)}]`);
        out(`negative control label-swap: discordant_rows=${labelSwap.discordantRows.length}`);
        for (const discordant of labelSwap.discordantRows) {
          out(`negative control label-swap: discordant row_id=${discordant.rowId} outcome=${discordant.outcome} label=${discordant.label} comparator=${discordant.comparatorPick} model=${discordant.modelPick}`);
        }

        columns.confidenceGated = await runArm(
          'jev',
          callable,
          baseline.chosen,
          gate,
          armCtx,
          { name: 'confidence-gated', confidenceGated: true }
        );
        columns.negativeControls.distractorState = await runArm(
          'jev',
          distractorStates(callable),
          baseline.chosen,
          gate,
          armCtx,
          { name: 'negative control distractor-state' }
        );
        if (scorerReport !== null) {
          analysis = scoreProbabilityArm(scorerReport, callable, primary.picks, primary.pickProbs, primary.noneProbs, baseline.chosen);
          out(analysis.probabilityAware.line);
          out(scorerReport.decidedSubsetLine('probability-aware', analysis.probabilityAware));
          out(scorerReport.marginSlackLine('probability-aware', analysis.probabilityAware.marginSlack));
          out(scorerReport.bootstrapLine('probability-aware', analysis.bootstrap));
        }
      }
    }

    if (jev && scorerReport !== null) {
      mkdirSync(armCtx.outDir, { recursive: true });
      const payload = {
        rows: { total: parsedRows.rows.length, labeled: labeled.length, callable: callable.length, stateNull },
        savePathSplit: { content: contentSaves, folder: folderSaves, other: otherSaves },
        candidateRecall,
        baseline,
        pins: {
          corpus_sha256: sha256(rowsBytes),
          scorer_sha256: sha256(readFileSync(new URL(import.meta.url))),
        },
        dataPin: scorerReport.pinRowSet(
          callable.map((row) => ({ id: row.id, target: row.target, label: effectiveLabel(row), stateSha256: sha256(row.state ?? '') }))
        ),
        columns,
        analysis: analysis ?? null,
      };
      const reportFile = path.join(armCtx.outDir, 'report.json');
      writeFileSync(reportFile, `${JSON.stringify(payload, null, 2)}\n`);
      const pins = {
        corpus_sha256: sha256(rowsBytes),
        report_sha256: sha256(readFileSync(reportFile)),
        scorer_sha256: sha256(readFileSync(new URL(import.meta.url))),
      };
      writeFileSync(path.join(armCtx.outDir, 'pins.json'), `${JSON.stringify(pins, null, 2)}\n`);
      out(`pins: corpus_sha256=${pins.corpus_sha256} report_sha256=${pins.report_sha256} scorer_sha256=${pins.scorer_sha256}`);
    }
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
