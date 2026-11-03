// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Record Writer
// ───────────────────────────────────────────────────────────────────
// Records operator decisions in a packet's decision-record.md. Two anchored
// sections carry them: a table a reader can scan, and an appendix that keeps the
// original wording byte for byte, because the exact options an operator was
// offered are part of the evidence for the choice.
//
// Every write is an upsert by id and never a document rewrite. A decision record
// also holds hand-authored ADRs, and a save must not disturb a byte of them.

import fs from 'node:fs';
import path from 'node:path';

import { detectLevel } from '../validation/orchestrator.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** One operator decision to record, together with the exchange that produced it. */
export interface OperatorDecisionEntry {
  /** Stable key for the question, used to keep the same id across saves. */
  sourceKey: string;
  /** What was decided, in the operator's or the model's short phrasing. */
  decided: string;
  /** Why the choice was made. Omitted when the exchange states no reason. */
  why?: string;
  /** An earlier decision this one replaces. */
  supersedes?: string;
  /** What carries the decision: requirements, files or anchors. */
  carriedBy: string;
  /** The question exactly as it was asked. */
  question: string;
  /** The options exactly as they were offered. */
  options: string[];
  /** The answer exactly as it was given. */
  answer: string;
}

/** A refused decision write, with the reason a caller can branch on. */
export class DecisionRecordWriteError extends Error {
  constructor(
    public code: 'NO_SPEC' | 'LEVEL_UNRESOLVED' | 'BAD_SOURCE_KEY',
    message: string,
  ) {
    super(message);
    this.name = 'DecisionRecordWriteError';
  }
}

/** What a decision write changed, and which id each source key now has. */
export interface DecisionRecordWriteResult {
  recordPath: string;
  created: boolean;
  changed: boolean;
  levelMarkerAdded: boolean;
  ids: Array<{ sourceKey: string; id: string }>;
}

type FieldName = 'question' | 'options' | 'answer';

interface FieldValue {
  text: string;
  fenced: boolean;
}

/** The appendix value read back for one id. */
interface VerbatimAppendixItem {
  sourceKey: string | null;
  question: string;
  options: string[];
  answer: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SOURCE_KEY_RE = /^[A-Za-z0-9:._-]+$/u;
const DECISION_ROW_RE = /^\|\s*(Q\d+)\s*\|/u;
const APPENDIX_HEADING_RE = /^###\s+(Q\d+)\s*$/u;
const SOURCE_COMMENT_RE = /^<!--\s*source:\s*(\S+)\s*-->$/u;
const FENCE_OPEN_RE = /^(`{3,})text$/u;
const FIELD_LABEL_RE =
  /^[ \t]*(?:\*\*(Question|Options|Answer)(?::\*\*|\*\*:)|(Question|Options|Answer):)[ \t]?(.*)$/u;

// The level shapes detectLevel accepts. A marker already present means the
// level survives the new decision-record.md, so no marker is added.
const LEVEL_MARKER_RE = /SPECKIT_LEVEL:\s*(1|2|3\+?|phase|review|research)/u;
const LEVEL_YAML_RE = /^level:\s*(1|2|3\+?|phase|review|research)\s*$/mu;
const LEVEL_TABLE_RE = /\|\s*\*\*Level\*\*\s*\|\s*(1|2|3\+?|phase|review|research)\s*\|/u;

const DECISIONS_OPEN = '<!-- ANCHOR:operator-decisions -->';
const DECISIONS_CLOSE = '<!-- /ANCHOR:operator-decisions -->';
const APPENDIX_OPEN = '<!-- ANCHOR:operator-answers-verbatim -->';
const APPENDIX_CLOSE = '<!-- /ANCHOR:operator-answers-verbatim -->';

const TABLE_HEADER = '| ID | Decided | Why | Supersedes | Carried by |';
const TABLE_SEPARATOR = '|----|---------|-----|------------|------------|';

const DECISIONS_BLOCK: readonly string[] = [
  DECISIONS_OPEN,
  '## Operator Decisions',
  '',
  TABLE_HEADER,
  TABLE_SEPARATOR,
  DECISIONS_CLOSE,
];

const APPENDIX_BLOCK: readonly string[] = [
  APPENDIX_OPEN,
  '## Appendix: Verbatim Operator Answers',
  '',
  'Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.',
  '',
  APPENDIX_CLOSE,
];

const TEMPLATE_SOURCE_LINE = '<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->';
const HVR_REFERENCE_LINE = '<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->';
const STATE_DIR_SEGMENTS = ['.skilled', 'skills', '.state', 'decision-capture'];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function formatId(value: number): string {
  return `Q${String(value).padStart(3, '0')}`;
}

/** Collapse a value onto one table cell and keep its pipe from splitting the row. */
function escapeCell(value: string): string {
  return value.replace(/[\r\n]+/gu, ' ').trim().replace(/\|/gu, '\\|');
}

function formatDecisionRow(id: string, entry: OperatorDecisionEntry): string {
  const why = escapeCell(entry.why ?? '') || 'Not stated.';
  const supersedes = escapeCell(entry.supersedes ?? '') || 'None';
  return `| ${id} | ${escapeCell(entry.decided)} | ${why} | ${supersedes} | ${escapeCell(entry.carriedBy)} |`;
}

/**
 * A fence one backtick longer than the longest run in the value. A shorter fence
 * would end early on a value that itself contains a Markdown code block.
 */
function fenceFor(value: string): string {
  const runs = value.match(/`+/gu) ?? [];
  const longest = runs.reduce((length, run) => Math.max(length, run.length), 0);
  return '`'.repeat(Math.max(3, longest + 1));
}

function fencedLines(value: string): string[] {
  const fence = fenceFor(value);
  return [`${fence}text`, ...value.split('\n'), fence];
}

function formatAppendixItem(id: string, entry: OperatorDecisionEntry): string[] {
  const lines = [
    `### ${id}`,
    `<!-- source: ${entry.sourceKey} -->`,
    '',
    'Question:',
    ...fencedLines(entry.question),
    '',
  ];

  if (entry.options.length === 0) {
    lines.push('Options: none');
  } else {
    lines.push('Options:', ...fencedLines(entry.options.join('\n')));
  }

  lines.push('', 'Answer:', ...fencedLines(entry.answer));
  return lines;
}

/**
 * Mark the lines inside a fenced block. A verbatim answer can quote a heading, a
 * table row or an anchor, and inside its fence that line is text, not structure.
 */
function fencedLineMask(lines: string[]): boolean[] {
  const mask = new Array<boolean>(lines.length).fill(false);
  let fence: string | null = null;
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (fence) {
      if (trimmed === fence) {
        fence = null;
      } else {
        mask[index] = true;
      }
      continue;
    }
    const opening = /^(`{3,})/u.exec(trimmed);
    if (opening) {
      fence = opening[1];
    }
  }
  return mask;
}

function sectionBounds(lines: string[], open: string, close: string): { start: number; end: number } | null {
  const mask = fencedLineMask(lines);
  const start = lines.findIndex((line, index) => !mask[index] && line.trim() === open);
  if (start === -1) {
    return null;
  }
  const end = lines.findIndex((line, index) => index > start && !mask[index] && line.trim() === close);
  if (end === -1) {
    return null;
  }
  return { start, end };
}

/**
 * Append a missing section at the end of the document. A record written before
 * this writer existed carries ADRs but no operator sections, and those anchors
 * have to be added without moving anything already in the file.
 */
function appendSectionIfMissing(lines: string[], open: string, close: string, block: readonly string[]): string[] {
  if (sectionBounds(lines, open, close)) {
    return lines;
  }
  const trimmed = [...lines];
  while (trimmed.length > 0 && trimmed[trimmed.length - 1].trim() === '') {
    trimmed.pop();
  }
  return [...trimmed, '', '---', '', ...block, ''];
}

function insertDecisionRow(lines: string[], id: string, row: string): string[] {
  const bounds = sectionBounds(lines, DECISIONS_OPEN, DECISIONS_CLOSE);
  if (!bounds) {
    return lines;
  }

  const mask = fencedLineMask(lines);
  for (let index = bounds.start + 1; index < bounds.end; index += 1) {
    if (!mask[index] && DECISION_ROW_RE.exec(lines[index].trim())?.[1] === id) {
      const next = [...lines];
      next[index] = row;
      return next;
    }
  }

  let lastTableLine = -1;
  for (let index = bounds.start + 1; index < bounds.end; index += 1) {
    if (!mask[index] && lines[index].trim().startsWith('|')) {
      lastTableLine = index;
    }
  }
  if (lastTableLine >= 0) {
    return [...lines.slice(0, lastTableLine + 1), row, ...lines.slice(lastTableLine + 1)];
  }
  return [...lines.slice(0, bounds.end), '', row, '', ...lines.slice(bounds.end)];
}

function appendixItemMatches(
  existing: VerbatimAppendixItem,
  entry: OperatorDecisionEntry,
): boolean {
  return existing.question === entry.question
    && existing.answer === entry.answer
    && existing.options.length === entry.options.length
    && existing.options.every((option, index) => option === entry.options[index]);
}

function insertAppendixItem(
  lines: string[],
  id: string,
  item: string[],
  entry: OperatorDecisionEntry,
): string[] {
  const bounds = sectionBounds(lines, APPENDIX_OPEN, APPENDIX_CLOSE);
  if (!bounds) {
    return lines;
  }

  const mask = fencedLineMask(lines);
  for (let index = bounds.start + 1; index < bounds.end; index += 1) {
    if (!mask[index] && APPENDIX_HEADING_RE.exec(lines[index].trim())?.[1] === id) {
      let itemEnd = bounds.end;
      for (let next = index + 1; next < bounds.end; next += 1) {
        if (!mask[next] && APPENDIX_HEADING_RE.test(lines[next].trim())) {
          itemEnd = next;
          break;
        }
      }

      const existing = parseAppendixBlock(lines.slice(index + 1, itemEnd));
      if (appendixItemMatches(existing, entry)) {
        return lines;
      }

      return [...lines.slice(0, index), ...item, '', ...lines.slice(itemEnd)];
    }
  }

  const next = [...lines];
  const before = next[bounds.end - 1];
  const lead = before !== undefined && before.trim() === '' ? [] : [''];
  next.splice(bounds.end, 0, ...lead, ...item, '');
  return next;
}

/** Anchor ids in the document, plus the key-to-id map the appendix comments carry. */
function readExistingIds(lines: string[]): { ids: Set<string>; keyToId: Map<string, string> } {
  const ids = new Set<string>();
  const keyToId = new Map<string, string>();
  const mask = fencedLineMask(lines);

  const decisions = sectionBounds(lines, DECISIONS_OPEN, DECISIONS_CLOSE);
  if (decisions) {
    for (let index = decisions.start + 1; index < decisions.end; index += 1) {
      const id = mask[index] ? undefined : DECISION_ROW_RE.exec(lines[index].trim())?.[1];
      if (id) {
        ids.add(id);
      }
    }
  }

  const appendix = sectionBounds(lines, APPENDIX_OPEN, APPENDIX_CLOSE);
  if (appendix) {
    for (let index = appendix.start + 1; index < appendix.end; index += 1) {
      const id = mask[index] ? undefined : APPENDIX_HEADING_RE.exec(lines[index].trim())?.[1];
      if (!id) {
        continue;
      }
      ids.add(id);
      let cursor = index + 1;
      while (cursor < appendix.end && lines[cursor].trim() === '') {
        cursor += 1;
      }
      const source = cursor < appendix.end ? SOURCE_COMMENT_RE.exec(lines[cursor].trim()) : null;
      if (source) {
        keyToId.set(source[1], id);
      }
    }
  }

  return { ids, keyToId };
}

function highestIdNumber(ids: Set<string>): number {
  let highest = 0;
  for (const id of ids) {
    highest = Math.max(highest, Number.parseInt(id.slice(1), 10));
  }
  return highest;
}

function hasExplicitLevel(specText: string): boolean {
  const head = specText.slice(0, 4096);
  return LEVEL_MARKER_RE.test(head) || LEVEL_YAML_RE.test(head) || LEVEL_TABLE_RE.test(head);
}

/**
 * Add the level marker without moving any existing line. detectLevel prefers a
 * decision-record.md over the tasks.md protocol anchor, so a packet whose level
 * was only implied would be read one level higher the moment the record exists.
 */
function addLevelMarker(specText: string, level: string): string {
  const eol = specText.includes('\r\n') ? '\r\n' : '\n';
  const lines = specText.split(/\r?\n/u);
  const marker = `<!-- SPECKIT_LEVEL: ${level} -->`;

  const h1Index = lines.findIndex((line) => /^#\s+/u.test(line));
  if (h1Index >= 0) {
    const next = [...lines];
    next.splice(h1Index + 1, 0, '', marker);
    return next.join(eol);
  }

  const frontmatterEnd = lines[0].replace(/^\uFEFF/u, '') === '---'
    ? lines.findIndex((line, index) => index > 0 && line.trim() === '---')
    : -1;
  if (frontmatterEnd >= 0) {
    const next = [...lines];
    next.splice(frontmatterEnd + 1, 0, '', marker);
    return next.join(eol);
  }

  return [marker, '', ...lines].join(eol);
}

function readRecordTitle(specText: string, folder: string): string {
  const basename = path.basename(folder);
  const heading = /^#\s+(.+)$/mu.exec(specText)?.[1]?.trim();
  if (!heading) {
    return basename;
  }
  const stripped = heading.replace(/^Feature Specification:\s*/u, '').trim();
  return stripped.length > 0 ? stripped : basename;
}

/** The packet id the continuity block names: the folder path below the specs root. */
function packetPointerFor(folder: string): string {
  const normalized = path.resolve(folder).split(path.sep).join('/');
  const marker = normalized.lastIndexOf('/specs/');
  return marker >= 0 ? normalized.slice(marker + '/specs/'.length) : path.basename(folder);
}

// The continuity block mirrors the decision-record template, because the
// validator expects every spec doc to carry one. The save writes the packet's
// real continuity into implementation-summary.md, so these stay template values.
function buildRecordDocument(title: string, basename: string, packetPointer: string, now: string): string {
  const quotedTitle = title.replace(/"/gu, '\\"');
  const quotedBasename = basename.replace(/"/gu, '\\"');
  return [
    '---',
    `title: "Decision Record: ${quotedTitle}"`,
    'description: "Operator decisions and their verbatim answers for this packet."',
    'trigger_phrases:',
    `  - "${quotedBasename} operator decisions"`,
    'importance_tier: "normal"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${packetPointer.replace(/"/gu, '\\"')}"`,
    `    last_updated_at: "${now}"`,
    '    last_updated_by: "decision-record-writer"',
    '    recent_action: "Recorded operator decisions"',
    '    next_safe_action: "Review the recorded operator decisions"',
    '    blockers: []',
    '    key_files: []',
    '    session_dedup:',
    `      fingerprint: "sha256:${'0'.repeat(64)}"`,
    '      session_id: "decision-record-writer"',
    '      parent_session_id: null',
    '    completion_pct: 0',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    `# Decision Record: ${title}`,
    '',
    TEMPLATE_SOURCE_LINE,
    HVR_REFERENCE_LINE,
    '',
    '---',
    '',
    ...DECISIONS_BLOCK,
    '',
    '---',
    '',
    ...APPENDIX_BLOCK,
    '',
  ].join('\n');
}

/** Temp file in the same folder, then rename, so a reader never sees a half-written record. */
function writeTextFile(filePath: string, text: string): void {
  const tempPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  fs.writeFileSync(tempPath, text, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function assertSourceKeys(entries: OperatorDecisionEntry[]): OperatorDecisionEntry[] {
  const seen = new Set<string>();
  const accepted: OperatorDecisionEntry[] = [];
  for (const entry of entries) {
    if (!SOURCE_KEY_RE.test(entry.sourceKey)) {
      throw new DecisionRecordWriteError(
        'BAD_SOURCE_KEY',
        `Invalid decision source key: ${JSON.stringify(entry.sourceKey)}`,
      );
    }
    if (seen.has(entry.sourceKey)) {
      continue;
    }
    seen.add(entry.sourceKey);
    accepted.push(entry);
  }
  return accepted;
}

// ───────────────────────────────────────────────────────────────────
// 4. VERBATIM APPENDIX PARSING
// ───────────────────────────────────────────────────────────────────

/**
 * Read one appendix item. Fenced values are taken exactly; an unfenced value is
 * read from the rest of its label line plus the lines before the next blank one,
 * which is how hand-written records in this repo state the same fields.
 */
function parseAppendixBlock(lines: string[]): VerbatimAppendixItem {
  const values: Record<FieldName, FieldValue> = {
    question: { text: '', fenced: false },
    options: { text: '', fenced: false },
    answer: { text: '', fenced: false },
  };

  let sourceKey: string | null = null;
  let index = 0;
  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (trimmed === '') {
      index += 1;
      continue;
    }
    const source = SOURCE_COMMENT_RE.exec(trimmed);
    if (!source) {
      break;
    }
    if (sourceKey === null) {
      sourceKey = source[1];
    }
    index += 1;
  }

  let field: FieldName | null = null;
  let buffer: string[] = [];
  let fenced = false;
  let fence: string | null = null;

  const commit = (): void => {
    if (!field) {
      return;
    }
    values[field] = { text: buffer.join('\n'), fenced };
    buffer = [];
    fenced = false;
  };

  for (; index < lines.length; index += 1) {
    const line = lines[index];

    if (fence) {
      if (line.trim() === fence) {
        commit();
        field = null;
        fence = null;
      } else {
        buffer.push(line);
      }
      continue;
    }

    if (line.trim() === '') {
      if (buffer.length > 0) {
        commit();
        field = null;
      }
      continue;
    }

    const opening = FENCE_OPEN_RE.exec(line.trim());
    if (opening && field) {
      fence = opening[1];
      fenced = true;
      buffer = [];
      continue;
    }

    const label = FIELD_LABEL_RE.exec(line);
    if (label) {
      commit();
      const fieldName = label[1] ?? label[2];
      field = fieldName.toLowerCase() as FieldName;
      buffer = label[3].length > 0 ? [label[3]] : [];
      continue;
    }

    if (field) {
      buffer.push(line);
    }
  }

  commit();

  // `Options: none` is how the writer records an empty choice set. A fenced
  // single option spelled the same way stays an option.
  let options: string[];
  if (!values.options.fenced && values.options.text.trim().toLowerCase() === 'none') {
    options = [];
  } else if (values.options.text.trim() === '') {
    options = [];
  } else if (values.options.fenced) {
    options = values.options.text.split('\n');
  } else {
    options = values.options.text
      .split(';')
      .map((option) => option.trim())
      .filter((option) => option.length > 0);
  }

  return {
    sourceKey,
    question: values.question.text,
    options,
    answer: values.answer.text,
  };
}

/** Parse the appendix section back into the exact question, options and answer per id. */
export function readVerbatimAppendix(
  markdown: string,
): Map<string, { sourceKey: string | null; question: string; options: string[]; answer: string }> {
  const lines = markdown.split('\n');
  const bounds = sectionBounds(lines, APPENDIX_OPEN, APPENDIX_CLOSE);
  const result = new Map<string, VerbatimAppendixItem>();
  if (!bounds) {
    return result;
  }

  const mask = fencedLineMask(lines);
  let current: { id: string; body: string[] } | null = null;
  for (let index = bounds.start + 1; index < bounds.end; index += 1) {
    const id = mask[index] ? undefined : APPENDIX_HEADING_RE.exec(lines[index].trim())?.[1];
    if (id) {
      if (current) {
        result.set(current.id, parseAppendixBlock(current.body));
      }
      current = { id, body: [] };
      continue;
    }
    current?.body.push(lines[index]);
  }
  if (current) {
    result.set(current.id, parseAppendixBlock(current.body));
  }

  return result;
}

// ───────────────────────────────────────────────────────────────────
// 5. RECORD WRITE
// ───────────────────────────────────────────────────────────────────

/** Case and spacing are dropped, since a hand-copied exchange rarely keeps either exactly. */
function exchangeKey(question: string, answer: string): string {
  const normalize = (value: string): string => value.replace(/\s+/gu, ' ').trim().toLowerCase();
  return `${normalize(question)}\n${normalize(answer)}`;
}

/**
 * Ids of appendix items written by hand, keyed by their question and answer. A
 * hand-written item has no source comment, so a later capture of the same
 * exchange arrives with a key the record has never seen, and its text is the only
 * thing left to match it on.
 */
function readUnkeyedExchangeIds(lines: string[]): Map<string, string> {
  const ids = new Map<string, string>();
  for (const [id, item] of readVerbatimAppendix(lines.join('\n'))) {
    if (item.sourceKey !== null || item.question.trim() === '' || item.answer.trim() === '') {
      continue;
    }
    const key = exchangeKey(item.question, item.answer);
    if (!ids.has(key)) {
      ids.set(key, id);
    }
  }
  return ids;
}

/**
 * Write operator decisions and their verbatim answers into a packet's
 * decision-record.md, creating the record when it does not exist.
 *
 * @param folder - The packet folder that owns the record
 * @param entries - Decisions to upsert by source key
 * @returns What the write changed and the id each source key now carries
 */
export function writeDecisionRecord(
  folder: string,
  entries: OperatorDecisionEntry[],
): DecisionRecordWriteResult {
  const accepted = assertSourceKeys(entries);
  const recordPath = path.join(folder, 'decision-record.md');
  const specPath = path.join(folder, 'spec.md');
  const recordExists = fs.existsSync(recordPath);

  // Nothing to record means nothing to create. A packet with no decisions keeps
  // whatever record it already has, and a folder without one stays that way.
  if (accepted.length === 0) {
    return { recordPath, created: false, changed: false, levelMarkerAdded: false, ids: [] };
  }

  let levelMarkerAdded = false;
  let specText = '';
  if (!recordExists) {
    if (!fs.existsSync(specPath)) {
      throw new DecisionRecordWriteError('NO_SPEC', `No spec.md in ${folder}`);
    }
    specText = fs.readFileSync(specPath, 'utf8');

    let before: string;
    try {
      before = detectLevel(folder);
    } catch (error) {
      throw new DecisionRecordWriteError(
        'LEVEL_UNRESOLVED',
        error instanceof Error ? error.message : `Could not resolve the level of ${folder}`,
      );
    }

    if (before !== 'phase' && !hasExplicitLevel(specText)) {
      writeTextFile(specPath, addLevelMarker(specText, before));
      levelMarkerAdded = true;
    }
  }

  const existingText = recordExists ? fs.readFileSync(recordPath, 'utf8') : '';
  let lines = recordExists
    ? existingText.split('\n')
    : buildRecordDocument(
      readRecordTitle(specText, folder),
      path.basename(folder),
      packetPointerFor(folder),
      new Date().toISOString(),
    ).split('\n');

  lines = appendSectionIfMissing(lines, DECISIONS_OPEN, DECISIONS_CLOSE, DECISIONS_BLOCK);
  lines = appendSectionIfMissing(lines, APPENDIX_OPEN, APPENDIX_CLOSE, APPENDIX_BLOCK);

  const existing = readExistingIds(lines);
  const unkeyed = readUnkeyedExchangeIds(lines);
  let nextNumber = highestIdNumber(existing.ids);
  const ids: Array<{ sourceKey: string; id: string }> = [];

  for (const entry of accepted) {
    let id = existing.keyToId.get(entry.sourceKey) ?? unkeyed.get(exchangeKey(entry.question, entry.answer));
    if (!id) {
      nextNumber += 1;
      id = formatId(nextNumber);
    }
    ids.push({ sourceKey: entry.sourceKey, id });
    lines = insertDecisionRow(lines, id, formatDecisionRow(id, entry));
    lines = insertAppendixItem(lines, id, formatAppendixItem(id, entry), entry);
  }

  const nextText = lines.join('\n');
  const changed = !recordExists || nextText !== existingText;
  if (!recordExists || changed) {
    writeTextFile(recordPath, nextText);
  }

  return { recordPath, created: !recordExists, changed, levelMarkerAdded, ids };
}

// ───────────────────────────────────────────────────────────────────
// 6. CONSUMED KEYS
// ───────────────────────────────────────────────────────────────────

/** One line of the consumed log, kept with its raw text so a caller can print it back. */
export interface ConsumedLogRow {
  readonly raw: string;
  readonly key: string;
  readonly packet: string;
  readonly id: string;
}

/**
 * Where the consumed log lives. A save appends to it and the matcher reads it back,
 * so both resolve the path here instead of each keeping its own copy of the name.
 */
export function consumedLogPath(projectRoot: string): string {
  return path.join(projectRoot, ...STATE_DIR_SEGMENTS, 'consumed.jsonl');
}

/**
 * Every usable row in the consumed log, and none when the file does not exist yet.
 * A torn or hand-edited line is skipped, and a row with no key is dropped: a row
 * that names no key records nothing, so it must not fail the whole read.
 */
export function readConsumedRows(projectRoot: string): ConsumedLogRow[] {
  let raw: string;
  try {
    raw = fs.readFileSync(consumedLogPath(projectRoot), 'utf8');
  } catch {
    return [];
  }
  const rows: ConsumedLogRow[] = [];
  for (const line of raw.split('\n')) {
    if (line.trim() === '') {
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      // Unparseable line: it records nothing, so it cannot hide a key.
      continue;
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      continue;
    }
    const row = parsed as Record<string, unknown>;
    const key = typeof row.key === 'string' ? row.key : '';
    if (key === '') {
      continue;
    }
    rows.push({
      raw: line,
      key,
      packet: typeof row.packet === 'string' ? row.packet : '',
      id: typeof row.id === 'string' ? row.id : '',
    });
  }
  return rows;
}

/**
 * Append the consumed source keys so a later save does not offer them again.
 * Every save passes back the ids of every entry it wrote, including ones it had
 * already recorded, so a key that is already in the log is not appended again.
 */
export function recordConsumedKeys(
  projectRoot: string,
  packet: string,
  ids: Array<{ sourceKey: string; id: string }>,
  now: string,
): void {
  if (ids.length === 0) {
    return;
  }

  const stateDir = path.join(projectRoot, ...STATE_DIR_SEGMENTS);
  const recorded = new Set(readConsumedRows(projectRoot).map((row) => row.key));
  const fresh = ids.filter(({ sourceKey }) => {
    if (recorded.has(sourceKey)) {
      return false;
    }
    recorded.add(sourceKey);
    return true;
  });
  if (fresh.length === 0) {
    return;
  }

  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  const lines = fresh
    .map(({ sourceKey, id }) => JSON.stringify({ key: sourceKey, packet, id, at: now }))
    .join('\n');
  fs.appendFileSync(consumedLogPath(projectRoot), `${lines}\n`, 'utf8');
}
