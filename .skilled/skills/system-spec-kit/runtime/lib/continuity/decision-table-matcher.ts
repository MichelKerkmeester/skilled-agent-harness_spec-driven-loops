// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Table Matcher
// ───────────────────────────────────────────────────────────────────

/** A decision row parsed from a hand-written Markdown table. */
export interface DecisionTableRow {
  id: string;
  date: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  line: number;
}

/** The queue fields used to identify a decision row. */
export interface DecisionQueueRecord {
  key: string;
  header: string;
  question: string;
  options: string[];
  answer: string;
  captured_at: string;
}

/** A prior row assignment recorded by the decision writer. */
export interface ConsumedDecisionRow {
  key: string;
  packet: string;
  id: string;
}

/** Weights for each evidence component in a row score. */
export interface DecisionMatchWeights {
  options: number;
  headerTopic: number;
  question: number;
  date: number;
}

/** Optional packet history and score settings for matching. */
export interface DecisionMatchOptions {
  packet?: string;
  answersByKey?: ReadonlyMap<string, string>;
  weights?: Partial<DecisionMatchWeights>;
  threshold?: number;
  tieMargin?: number;
}

/** The accepted, refused, and pending queue records from one matching run. */
export interface DecisionMatchResult {
  matches: Array<{ key: string; id: string; score: number }>;
  refused: Array<{ key: string; reason: string }>;
  pending: Array<{ key: string; reason: string }>;
}

/** Default contribution of options, topic, question, and date evidence. */
export const DEFAULT_WEIGHTS: Readonly<DecisionMatchWeights> = Object.freeze({
  options: 0.35,
  headerTopic: 0.3,
  question: 0.3,
  date: 0.05,
});

/** Minimum weighted score required after the answer gate passes. */
export const DEFAULT_THRESHOLD = 0.4;

/** Maximum score gap that still counts as an ambiguous row choice. */
export const DEFAULT_TIE_MARGIN = 0.05;

interface ScoredRow {
  row: DecisionTableRow;
  score: number;
  rowIndex: number;
}

/** Parse every qualifying Q-row table and retain source line numbers. */
export function parseDecisionTables(text: string): DecisionTableRow[] {
  const lines = text.split(/\r?\n/);
  const rows: DecisionTableRow[] = [];

  for (let headerIndex = 0; headerIndex < lines.length - 1; headerIndex += 1) {
    const headers = splitTableCells(lines[headerIndex] ?? '');
    const separators = splitTableCells(lines[headerIndex + 1] ?? '');
    if (!isSeparatorRow(separators, headers.length)) {
      continue;
    }

    const columns = findDecisionColumns(headers);
    if (columns === null) {
      continue;
    }

    let rowIndex = headerIndex + 2;
    while (rowIndex < lines.length) {
      const line = lines[rowIndex] ?? '';
      if (line.trim() === '') {
        break;
      }

      const cells = splitTableCells(line);
      const id = cells[0] ?? '';
      if (!/^Q\d+$/.test(id)) {
        break;
      }

      rows.push({
        id,
        date: cells[columns.date] ?? '',
        topic: cells[columns.topic] ?? '',
        question: cells[columns.question] ?? '',
        options: splitOptions(cells[columns.options] ?? ''),
        answer: cells[columns.answer] ?? '',
        line: rowIndex + 1,
      });
      rowIndex += 1;
    }

    headerIndex = rowIndex - 1;
  }

  return rows;
}

/** Normalize answers and labels before comparing or tokenizing them. */
export function normalize(value: string): string {
  let normalized = value.trim();
  const first = normalized[0];
  const last = normalized[normalized.length - 1];

  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    normalized = normalized.slice(1, -1);
  }

  return normalized
    .replace(/\(Recommended\)|\(rec\.\)/gi, '')
    .replace(/\r\n?|\n/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Match queue records in order, refusing ambiguous or previously used rows. */
export function matchRecords(
  records: readonly DecisionQueueRecord[],
  rows: readonly DecisionTableRow[],
  consumedRows: readonly ConsumedDecisionRow[],
  opts: DecisionMatchOptions = {},
): DecisionMatchResult {
  const result: DecisionMatchResult = { matches: [], refused: [], pending: [] };
  const usedIds = new Set<string>();
  const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
  const tieMargin = opts.tieMargin ?? DEFAULT_TIE_MARGIN;
  const weights = { ...DEFAULT_WEIGHTS, ...opts.weights };

  for (const record of records) {
    const answer = normalize(record.answer);
    const answerRows: ScoredRow[] = [];

    rows.forEach((row, rowIndex) => {
      if (answer !== normalize(row.answer)) {
        return;
      }

      const score = scoreRow(record, row, weights);
      answerRows.push({ row, score, rowIndex });
    });

    const passingRows = answerRows.filter((candidate) => candidate.score >= threshold);
    if (passingRows.length === 0) {
      result.pending.push({ key: record.key, reason: 'no row' });
      continue;
    }

    passingRows.sort((left, right) =>
      right.score - left.score || left.row.line - right.row.line || left.rowIndex - right.rowIndex,
    );

    const best = passingRows[0];
    if (best === undefined) {
      result.pending.push({ key: record.key, reason: 'no row' });
      continue;
    }

    const tied = answerRows.some(
      (candidate) => candidate.rowIndex !== best.rowIndex && best.score - candidate.score <= tieMargin,
    );
    if (tied) {
      result.refused.push({ key: record.key, reason: 'tie' });
      continue;
    }

    if (
      usedIds.has(best.row.id) ||
      wasConsumedByDifferentAnswer(record, best.row, consumedRows, opts)
    ) {
      result.refused.push({
        key: record.key,
        reason: 'row already consumed by a different answer',
      });
      continue;
    }

    usedIds.add(best.row.id);
    result.matches.push({ key: record.key, id: best.row.id, score: best.score });
  }

  return result;
}

/** Format counts using the decision-capture run summary wording. */
export function summaryLine(result: DecisionMatchResult): string {
  return `consumed ${result.matches.length}, refused ${result.refused.length}, pending ${result.pending.length}`;
}

function splitTableCells(line: string): string[] {
  const cells: string[] = [];
  let current = '';

  for (const character of line) {
    if (character !== '|') {
      current += character;
      continue;
    }

    let backslashCount = 0;
    for (let index = current.length - 1; index >= 0 && current[index] === '\\'; index -= 1) {
      backslashCount += 1;
    }

    if (backslashCount % 2 === 1) {
      current = `${current.slice(0, -1)}|`;
      continue;
    }

    cells.push(current.trim());
    current = '';
  }
  cells.push(current.trim());

  const trimmed = line.trim();
  if (trimmed.startsWith('|')) {
    cells.shift();
  }
  if (trimmed.endsWith('|') && !isEscapedPipe(trimmed, trimmed.length - 1)) {
    cells.pop();
  }

  return cells;
}

function isEscapedPipe(value: string, pipeIndex: number): boolean {
  let backslashCount = 0;
  for (let index = pipeIndex - 1; index >= 0 && value[index] === '\\'; index -= 1) {
    backslashCount += 1;
  }
  return backslashCount % 2 === 1;
}

function isSeparatorRow(cells: readonly string[], expectedCellCount: number): boolean {
  return (
    cells.length === expectedCellCount &&
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell))
  );
}

function findDecisionColumns(headers: readonly string[]): {
  date: number;
  topic: number;
  question: number;
  options: number;
  answer: number;
} | null {
  const names = headers.map((header) => header.replace(/\s+/g, ' ').trim().toLowerCase());
  const date = findHeader(names, ['date']);
  const topic = findHeader(names, ['topic']);
  const question = findHeader(names, ['question']);
  const options = findHeader(names, ['options offered', 'options']);
  const answer = findHeader(names, ['answer (verbatim)', 'answer']);

  if (date < 0 || topic < 0 || question < 0 || options < 0 || answer < 0) {
    return null;
  }

  return { date, topic, question, options, answer };
}

function findHeader(headers: readonly string[], acceptedNames: readonly string[]): number {
  return headers.findIndex((header) => acceptedNames.includes(header));
}

function splitOptions(value: string): string[] {
  if (value.trim() === '') {
    return [];
  }
  return value.split('; ').map((option) => option.trim());
}

function scoreRow(
  record: DecisionQueueRecord,
  row: DecisionTableRow,
  weights: DecisionMatchWeights,
): number {
  const totalWeight = weights.options + weights.headerTopic + weights.question + weights.date;
  if (totalWeight <= 0) {
    return 0;
  }

  const optionScore = optionTokenOverlap(record.options, row.options);
  const topicScore = tokenOverlap(record.header, row.topic);
  const questionScore = tokenOverlap(record.question, row.question);
  const dateScore = sameDay(record.captured_at, row.date) ? 1 : 0;

  return (
    (optionScore * weights.options +
      topicScore * weights.headerTopic +
      questionScore * weights.question +
      dateScore * weights.date) /
    totalWeight
  );
}

function optionTokenOverlap(left: readonly string[], right: readonly string[]): number {
  return (averageBestOverlap(left, right) + averageBestOverlap(right, left)) / 2;
}

function averageBestOverlap(source: readonly string[], candidates: readonly string[]): number {
  if (source.length === 0 || candidates.length === 0) {
    return 0;
  }

  const total = source.reduce((sum, value) => {
    const best = candidates.reduce(
      (score, candidate) => Math.max(score, tokenOverlap(value, candidate)),
      0,
    );
    return sum + best;
  }, 0);

  return total / source.length;
}

function tokenOverlap(left: string, right: string): number {
  const leftTokens = new Set(normalize(left).match(/[\p{L}\p{N}]+/gu) ?? []);
  const rightTokens = new Set(normalize(right).match(/[\p{L}\p{N}]+/gu) ?? []);
  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  }

  return (2 * overlap) / (leftTokens.size + rightTokens.size);
}

function sameDay(capturedAt: string, rowDate: string): boolean {
  const capturedTime = Date.parse(capturedAt);
  const rowTime = Date.parse(rowDate);
  if (Number.isNaN(capturedTime) || Number.isNaN(rowTime)) {
    return false;
  }

  const capturedDay = new Date(capturedTime).toISOString().slice(0, 10);
  const decisionDay = new Date(rowTime).toISOString().slice(0, 10);
  return capturedDay === decisionDay;
}

function wasConsumedByDifferentAnswer(
  record: DecisionQueueRecord,
  row: DecisionTableRow,
  consumedRows: readonly ConsumedDecisionRow[],
  opts: DecisionMatchOptions,
): boolean {
  if (opts.packet === undefined || opts.answersByKey === undefined) {
    return false;
  }

  return consumedRows.some((consumed) => {
    if (consumed.packet !== opts.packet || consumed.id !== row.id || consumed.key === record.key) {
      return false;
    }

    const previousAnswer = opts.answersByKey?.get(consumed.key);
    return previousAnswer !== undefined && normalize(previousAnswer) !== normalize(record.answer);
  });
}
