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

// ───────────────────────────────────────────────────────────────────
// 3. LINE SCAN
// ───────────────────────────────────────────────────────────────────

const CLI_HEADER = /^\s*Phase 1B Alignment: (.+) \((\d+)% match\)\s*$/;
const DATA_HEADER = /^\s*Alignment check: (.+) \((\d+)% match\)\s*$/;

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
