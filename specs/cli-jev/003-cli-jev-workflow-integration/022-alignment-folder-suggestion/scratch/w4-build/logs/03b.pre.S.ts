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
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

const CLI_ALIGNED = /^\s*(?:Warning: )?Content aligns with target folder/;
const CLI_MODERATE = /^\s*(?:Warning: )?Moderate alignment \(/;
const CLI_LOW = /^\s*(?:Warning: )?ALIGNMENT WARNING: Content may not match/;
const CLI_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE ALIGNMENT WARNING/;

const DATA_ALIGNED = /^\s*(?:Warning: )?Good alignment with selected folder/;
const DATA_MODERATE = /^\s*(?:Warning: )?Moderate alignment - proceeding/;
const DATA_LOW = /^\s*(?:Warning: )?LOW ALIGNMENT WARNING/;
const DATA_INFRASTRUCTURE = /^\s*(?:Warning: )?INFRASTRUCTURE MISMATCH \(/;

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
  try {
    const { values } = parseArgs({ args: argv, options: MAIN_OPTIONS, strict: true, allowPositionals: false });
    report = values.report;
    transcripts = values.transcripts;
    rowsOut = values['rows-out'];
    score = values.score;
    outDir = values.out;
    jev = values.jev === true;
    deem = values.deem === true;
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

  if (score !== undefined) {
    err('--score is not built yet');
    return 2;
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

  out('transcript events: not measured');

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
      transcripts: null,
    };
    writeFileSync(path.join(report, 'report.json'), `${JSON.stringify(payload, null, 2)}\n`);
  }

  return 0;
}

if (isMainModule(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
