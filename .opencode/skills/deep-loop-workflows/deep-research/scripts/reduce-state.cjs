// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Research State Reducer                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { emitResourceMap } = require('../../shared/synthesis/resource-map.cjs');
const { resolveArtifactRoot } = require('../../../deep-loop-runtime/lib/deep-loop/artifact-root.cjs');
const {
  buildCarriedForwardOpenQuestions,
  deriveNextFocusFromContinuity,
  formatCarriedForwardOpenQuestions,
} = require('../../../deep-loop-runtime/lib/deep-loop/continuity-thread.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SPARKLINE_WIDTH = 20;
const DEFAULT_TREND_FLATLINE_WINDOW = 3;
const INBOX_FILE_NAME = 'inbox.jsonl';
const DEFAULT_INBOX_SOURCE = 'research-inbox';
const LEGACY_IMPORT_ORIGIN = 'legacy-import';
const LEGACY_IMPORT_SOURCE = 'key-questions';
const VALID_QUESTION_ORIGINS = new Set([
  'angle-bank',
  'analyst-strategy',
  'operator',
  LEGACY_IMPORT_ORIGIN,
]);
const SPARKLINE_BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readUtf8(filePath));
}

function getResourceMapEmitSetting(config) {
  const nested = config && typeof config === 'object'
    ? (config.resource_map || config.resourceMap || null)
    : null;
  if (nested && typeof nested === 'object' && typeof nested.emit === 'boolean') {
    return nested.emit;
  }
  return true;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'entry';
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeOptionalText(value) {
  return typeof value === 'string' ? normalizeText(value) : '';
}

function normalizeQuestionOrigin(value) {
  const origin = normalizeOptionalText(value).toLowerCase();
  return VALID_QUESTION_ORIGINS.has(origin) ? origin : 'operator';
}

function normalizeQuestionSource(value, fallback) {
  return normalizeOptionalText(value) || fallback;
}

function normalizeQuestionIteration(value) {
  return isFiniteNumber(value) && value >= 0 ? Math.floor(value) : 0;
}

function normalizeQuestionId(value) {
  const normalized = normalizeOptionalText(value);
  return normalized || null;
}

function contentHash(value) {
  return crypto
    .createHash('sha256')
    .update(normalizeText(String(value)).toLowerCase())
    .digest('hex')
    .slice(0, 12);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSparklineWidth(opts) {
  const rawWidth = opts && typeof opts === 'object' ? opts.width : undefined;
  return Number.isInteger(rawWidth) && rawWidth > 0
    ? rawWidth
    : DEFAULT_SPARKLINE_WIDTH;
}

function normalizeSparklineHistory(history) {
  return Array.isArray(history)
    ? history.filter((value) => typeof value === 'number' && Number.isFinite(value))
    : [];
}

/**
 * Render numeric history as a fixed-width sparkline for compact trend scans.
 *
 * @param {number[]} history - Numeric values to render.
 * @param {Object} [opts] - Render options.
 * @param {number} [opts.width=20] - Output character width.
 * @returns {string} Fixed-width sparkline, or an empty string when no finite values exist.
 */
function renderSparkline(history, opts = {}) {
  const values = normalizeSparklineHistory(history);
  if (!values.length) {
    return '';
  }

  const width = resolveSparklineWidth(opts);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const flatBlock = SPARKLINE_BLOCKS[Math.floor((SPARKLINE_BLOCKS.length - 1) / 2)];

  if (values.length === 1 || min === max) {
    return flatBlock.repeat(width);
  }

  const rendered = [];
  for (let index = 0; index < width; index += 1) {
    const sourcePosition = width === 1
      ? values.length - 1
      : (index / (width - 1)) * (values.length - 1);
    const lowerIndex = Math.floor(sourcePosition);
    const upperIndex = Math.min(values.length - 1, Math.ceil(sourcePosition));
    const mix = sourcePosition - lowerIndex;
    const value = lowerIndex === upperIndex
      ? values[lowerIndex]
      : values[lowerIndex] + ((values[upperIndex] - values[lowerIndex]) * mix);
    const normalized = (value - min) / (max - min);
    const blockIndex = Math.max(
      0,
      Math.min(SPARKLINE_BLOCKS.length - 1, Math.round(normalized * (SPARKLINE_BLOCKS.length - 1))),
    );
    rendered.push(SPARKLINE_BLOCKS[blockIndex]);
  }

  return rendered.join('');
}

function resolveTrendFlatlineWindow(config) {
  const rawWindow =
    config?.trendFlatlineWindow
    ?? config?.trendFlatlineIterations
    ?? config?.stuckThreshold
    ?? DEFAULT_TREND_FLATLINE_WINDOW;
  return Number.isInteger(rawWindow) && rawWindow >= 2
    ? rawWindow
    : DEFAULT_TREND_FLATLINE_WINDOW;
}

function isFlatSparkline(sparkline) {
  return typeof sparkline === 'string'
    && sparkline.length >= 2
    && new Set(Array.from(sparkline)).size === 1;
}

function readIterationScore(record) {
  const convergenceSignals = record?.convergenceSignals && typeof record.convergenceSignals === 'object'
    ? record.convergenceSignals
    : {};
  return convergenceSignals.compositeStop
    ?? convergenceSignals.score
    ?? convergenceSignals.convergenceScore
    ?? convergenceSignals.stopScore
    ?? record?.score
    ?? record?.newInfoRatio;
}

function readIterationRun(record) {
  const run = record?.run ?? record?.iteration;
  return isFiniteNumber(run) ? run : null;
}

function hasLogRegionFields(record) {
  return isFiniteNumber(record?.logOffset)
    || isFiniteNumber(record?.logSize)
    || (typeof record?.logPath === 'string' && record.logPath !== '');
}

function formatLogRegionNumber(value) {
  return isFiniteNumber(value) ? String(value) : '-';
}

function formatLogRegionPath(value) {
  return typeof value === 'string' && value ? value : '-';
}

function buildTrendFlatlineAdvisories(config, histories, latestRecord) {
  const window = resolveTrendFlatlineWindow(config);
  return Object.entries(histories)
    .flatMap(([metric, history]) => {
      const values = normalizeSparklineHistory(history);
      if (values.length < window) {
        return [];
      }

      const recent = values.slice(-window);
      const sparkline = renderSparkline(recent, { width: window });
      if (!isFlatSparkline(sparkline)) {
        return [];
      }

      return [{
        type: 'event',
        event: 'trend_flatline',
        mode: 'research',
        severity: 'advisory',
        metric,
        run: readIterationRun(latestRecord),
        window,
        value: recent.at(-1),
        sparkline,
        timestamp: typeof latestRecord?.timestamp === 'string' && latestRecord.timestamp
          ? latestRecord.timestamp
          : null,
      }];
    });
}

function formatTrendAdvisoryEvent(event) {
  const metric = typeof event?.metric === 'string' && event.metric ? event.metric : 'unknown';
  const run = isFiniteNumber(event?.run) ? event.run : 'unknown';
  const window = isFiniteNumber(event?.window) ? event.window : 'unknown';
  const sparkline = typeof event?.sparkline === 'string' && event.sparkline ? event.sparkline : 'N/A';
  return `- Advisory event: ${event?.event || 'advisory'} metric=${metric} run=${run} window=${window} sparkline=${sparkline}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records. Backward-compatible array
 * return; corrupt lines are silently dropped. For fail-closed behavior use
 * parseJsonlDetailed().
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {Array<Object>} Parsed records
 */
function parseJsonl(jsonlContent) {
  return parseJsonlDetailed(jsonlContent).records;
}

/**
 * Parse JSONL content and report malformed lines (fail-closed pathway,
 * research reducer parity with deep-review Part C).
 *
 * The reducer exit code is non-zero when corruption warnings are present
 * unless `--lenient` is passed to the CLI (or `lenient:true` to
 * reduceResearchState).
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}

function readInboxQuestions(inboxPath) {
  if (!fs.existsSync(inboxPath)) {
    return {
      questions: [],
      warnings: [],
      corruptionWarnings: [],
    };
  }

  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(inboxPath));
  const warnings = corruptionWarnings.map((warning) =>
    `line ${warning.line}: ${warning.error}`,
  );
  const questions = [];

  records.forEach((record, index) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      warnings.push(`record ${index + 1}: expected an object`);
      return;
    }

    const text = normalizeOptionalText(record.text);
    if (!text) {
      warnings.push(`record ${index + 1}: missing text`);
      return;
    }

    questions.push({
      checked: false,
      text,
      inboxId: normalizeQuestionId(record.id) || `inbox-${index + 1}-${contentHash(text)}`,
      source: normalizeQuestionSource(record.source, DEFAULT_INBOX_SOURCE),
      origin: normalizeQuestionOrigin(record.origin),
      injectedAtIteration: normalizeQuestionIteration(record.injectedAtIteration),
      promotedQuestionId: normalizeQuestionId(record.promotedQuestionId),
    });
  });

  return {
    questions,
    warnings,
    corruptionWarnings,
  };
}

function mergeQuestionSources(strategyQuestions, inboxQuestions) {
  const merged = [];
  const byQuestionText = new Map();

  for (const question of strategyQuestions.concat(inboxQuestions)) {
    const normalizedText = normalizeText(question.text);
    const key = contentHash(normalizedText);
    const existingIndex = byQuestionText.get(key);

    if (existingIndex === undefined) {
      byQuestionText.set(key, merged.length);
      merged.push({
        ...question,
        text: normalizedText,
      });
      continue;
    }

    const existing = merged[existingIndex];
    merged[existingIndex] = {
      ...existing,
      ...question,
      checked: Boolean(existing.checked || question.checked),
      text: existing.text,
    };
  }

  return merged;
}

function warnLegacyImportQuestions(questions) {
  const legacyCount = questions.filter((question) => question.origin === LEGACY_IMPORT_ORIGIN).length;
  if (!legacyCount) {
    return;
  }

  console.warn(
    `[deep-research] detected ${legacyCount} legacy-import question(s) in key-questions; append external questions to research/inbox.jsonl instead.`,
  );
}

function loadDeltaPayloads(deltaDir) {
  if (!fs.existsSync(deltaDir)) {
    return [];
  }

  return fs.readdirSync(deltaDir)
    .filter((fileName) => /^iter-\d+\.jsonl$/.test(fileName))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((fileName) => {
      const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(path.join(deltaDir, fileName)));
      if (!corruptionWarnings.length) {
        return records;
      }
      console.warn(
        `[deep-research] resource-map extractor skipped ${corruptionWarnings.length} malformed delta row(s) from ${fileName}`,
      );
      return records.concat(new Array(corruptionWarnings.length).fill(null));
    });
}

function createCorruptionError(stateLogPath, corruptionWarnings) {
  const preview = corruptionWarnings
    .slice(0, 3)
    .map((warning) => `  - line ${warning.line}: ${warning.error}`)
    .join('\n');
  const error = new Error(
    `[deep-research] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
    + 'Pass --lenient to the reducer CLI (or lenient:true to reduceResearchState) to ignore corruption.',
  );
  error.code = 'STATE_CORRUPTION';
  error.corruptionWarnings = corruptionWarnings;
  error.stateLogPath = stateLogPath;
  return error;
}

function createRecoveryRefusedError(stateLogPath, reason, details = {}) {
  const error = new Error(`[deep-research] refusing resume: ${reason} (${stateLogPath})`);
  error.code = 'STATE_RECOVERY_REFUSED';
  error.reason = reason;
  error.stateLogPath = stateLogPath;
  Object.assign(error, details);
  return error;
}

function readStateLogForReduction(stateLogPath, requireExistingState) {
  if (requireExistingState && !fs.existsSync(stateLogPath)) {
    throw createRecoveryRefusedError(stateLogPath, 'missing state log');
  }

  const content = readUtf8(stateLogPath);
  if (requireExistingState && content.trim() === '') {
    throw createRecoveryRefusedError(stateLogPath, 'empty state log');
  }

  const parsed = parseJsonlDetailed(content);
  if (requireExistingState && parsed.corruptionWarnings.length > 0) {
    throw createRecoveryRefusedError(stateLogPath, 'corrupt state log', {
      corruptionWarnings: parsed.corruptionWarnings,
    });
  }
  return parsed;
}

function extractSection(markdown, heading) {
  // Drop the `m` flag so `$` anchors to end-of-string, not end-of-line
  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}[^\\S\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function extractListItems(sectionText) {
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
    .filter(Boolean);
}

function parseReflectionValue(sectionText, label) {
  const match = sectionText.match(new RegExp(`-\\s+${escapeRegExp(label)}\\s*:\\s*(.+)`, 'i'));
  return match ? normalizeText(match[1]) : null;
}

/**
 * Parse a single iteration markdown file into a structured record.
 *
 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
 * @returns {Object} Parsed iteration with focus, findings, sources, and reflection fields
 */
function parseIterationFile(iterationPath) {
  const markdown = readUtf8(iterationPath);
  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
  const focusSection = extractSection(markdown, 'Focus');
  const findingsSection = extractSection(markdown, 'Findings');
  const ruledOutSection = extractSection(markdown, 'Ruled Out');
  const deadEndsSection = extractSection(markdown, 'Dead Ends');
  const questionsRemainingSection = extractSection(markdown, 'Questions Remaining');
  const sourcesSection = extractSection(markdown, 'Sources Consulted');
  const reflectionSection = extractSection(markdown, 'Reflection');
  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');

  return {
    path: iterationPath,
    run: runMatch ? Number(runMatch[1]) : 0,
    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
    findings: extractListItems(findingsSection),
    ruledOut: extractListItems(ruledOutSection),
    deadEnds: extractListItems(deadEndsSection),
    questionsRemaining: extractListItems(questionsRemainingSection),
    sources: extractListItems(sourcesSection),
    reflectionWorked: parseReflectionValue(reflectionSection, 'What worked and why'),
    reflectionFailed: parseReflectionValue(reflectionSection, 'What did not work and why'),
    reflectionDifferent: parseReflectionValue(reflectionSection, 'What I would do differently'),
    nextFocus: normalizeText(nextFocusSection),
  };
}

function parseStrategyQuestions(strategyContent) {
  const section = extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
    .map((line) => {
      const checked = /^- \[[xX]\]\s+/.test(line);
      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
      return {
        checked,
        text,
        origin: LEGACY_IMPORT_ORIGIN,
        source: LEGACY_IMPORT_SOURCE,
        injectedAtIteration: 0,
        promotedQuestionId: null,
      };
    });
}

function buildCoverageBySources(iterationFiles, iterationRecords) {
  const counter = {};
  const seen = new Set();

  for (const source of iterationFiles.flatMap((iteration) => iteration.sources).concat(
    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
  )) {
    const normalized = normalizeText(source);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    let key = 'other';
    if (/^https?:\/\//i.test(normalized)) {
      try {
        key = new URL(normalized).hostname;
      } catch (_error) {
        key = 'web';
      }
    } else if (normalized.startsWith('memory:')) {
      key = 'memory';
    } else if (normalized.includes(':')) {
      key = 'code';
    }

    counter[key] = (counter[key] || 0) + 1;
  }

  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)));
}

function uniqueById(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

function uniqueRuledOutByContent(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const hash = item.contentHash || contentHash(item.text);
    if (seen.has(hash)) {
      continue;
    }
    seen.add(hash);
    result.push({
      ...item,
      contentHash: hash,
    });
  }

  return result;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function computeGraphConvergenceScore(signals) {
  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
    return 0;
  }

  const namedScore = signals.blendedScore
    ?? signals.score
    ?? signals.convergenceScore
    ?? signals.compositeScore
    ?? signals.stopScore
    ?? signals.decisionScore;
  if (isFiniteNumber(namedScore)) {
    return namedScore;
  }

  const numericSignals = Object.values(signals)
    .filter((value) => isFiniteNumber(value));
  if (!numericSignals.length) {
    return 0;
  }

  const sum = numericSignals.reduce((total, value) => total + value, 0);
  return sum / numericSignals.length;
}

function buildGraphConvergenceRollup(eventRecords) {
  const latestGraphConvergence = eventRecords.filter((record) => record.event === 'graph_convergence').at(-1);
  const signals = latestGraphConvergence?.signals && typeof latestGraphConvergence.signals === 'object'
    ? latestGraphConvergence.signals
    : {};
  const blockers = Array.isArray(latestGraphConvergence?.blockers)
    ? latestGraphConvergence.blockers
    : [];

  return {
    graphConvergenceScore: computeGraphConvergenceScore(signals),
    graphDecision: typeof latestGraphConvergence?.decision === 'string'
      ? latestGraphConvergence.decision
      : null,
    graphBlockers: blockers,
  };
}

function buildLineageState(config, eventRecords) {
  const configLineage = config.lineage && typeof config.lineage === 'object'
    ? config.lineage
    : {};
  const latestLifecycleEvent = eventRecords
    .filter((record) => record.event === 'resumed' || record.event === 'restarted')
    .at(-1);
  const eventContinuedFromRun = latestLifecycleEvent
    ? latestLifecycleEvent.continuedFromRun ?? latestLifecycleEvent.fromIteration
    : undefined;
  const eventHasParentSession = latestLifecycleEvent
    && Object.prototype.hasOwnProperty.call(latestLifecycleEvent, 'parentSessionId');

  return {
    sessionId: typeof latestLifecycleEvent?.sessionId === 'string' && latestLifecycleEvent.sessionId
      ? latestLifecycleEvent.sessionId
      : typeof configLineage.sessionId === 'string' && configLineage.sessionId
        ? configLineage.sessionId
        : null,
    parentSessionId: eventHasParentSession
      ? (typeof latestLifecycleEvent.parentSessionId === 'string' && latestLifecycleEvent.parentSessionId
          ? latestLifecycleEvent.parentSessionId
          : null)
      : typeof configLineage.parentSessionId === 'string' && configLineage.parentSessionId
        ? configLineage.parentSessionId
        : null,
    lineageMode: typeof latestLifecycleEvent?.lineageMode === 'string' && latestLifecycleEvent.lineageMode
      ? latestLifecycleEvent.lineageMode
      : typeof configLineage.lineageMode === 'string' && configLineage.lineageMode
        ? configLineage.lineageMode
        : 'new',
    generation: isFiniteNumber(latestLifecycleEvent?.generation)
      ? latestLifecycleEvent.generation
      : isFiniteNumber(configLineage.generation)
        ? configLineage.generation
        : 1,
    continuedFromRun: eventContinuedFromRun !== undefined
      ? (isFiniteNumber(eventContinuedFromRun) ? eventContinuedFromRun : null)
      : isFiniteNumber(configLineage.continuedFromRun)
        ? configLineage.continuedFromRun
        : null,
  };
}

function buildTerminalStopState(records) {
  const eventRecords = records.filter((record) => record?.type === 'event');
  const latestSynthesisComplete = eventRecords.filter((record) => record.event === 'synthesis_complete').at(-1);
  if (!latestSynthesisComplete) {
    return null;
  }

  const latestSynthesisIndex = records.lastIndexOf(latestSynthesisComplete);
  const latestIterationIndex = Math.max(
    records.findLastIndex((record) => record?.type === 'iteration'),
    records.findLastIndex((record) => record?.type === 'event' && (record?.event === 'resumed' || record?.event === 'restarted')),
  );
  if (latestSynthesisIndex < latestIterationIndex) {
    return null;
  }

  return {
    stopReason: typeof latestSynthesisComplete.stopReason === 'string' && latestSynthesisComplete.stopReason
      ? latestSynthesisComplete.stopReason
      : null,
    totalIterations: isFiniteNumber(latestSynthesisComplete.totalIterations)
      ? latestSynthesisComplete.totalIterations
      : null,
    answeredCount: isFiniteNumber(latestSynthesisComplete.answeredCount)
      ? latestSynthesisComplete.answeredCount
      : null,
    totalQuestions: isFiniteNumber(latestSynthesisComplete.totalQuestions)
      ? latestSynthesisComplete.totalQuestions
      : null,
    timestamp: typeof latestSynthesisComplete.timestamp === 'string' && latestSynthesisComplete.timestamp
      ? latestSynthesisComplete.timestamp
      : null,
  };
}

function deriveDashboardStatus(config, iterationRecords, eventRecords, terminalStop) {
  if (terminalStop) {
    return 'COMPLETE';
  }

  const latestStuckRecovery = eventRecords.filter((record) => record.event === 'stuckRecovery').at(-1);
  const latestIterationTimestamp = getTimestampValue(iterationRecords.at(-1)?.timestamp);
  const latestRecoveryTimestamp = getTimestampValue(latestStuckRecovery?.timestamp);
  if (latestRecoveryTimestamp >= latestIterationTimestamp && latestRecoveryTimestamp > Number.NEGATIVE_INFINITY) {
    return 'STUCK_RECOVERY';
  }

  if (iterationRecords.at(-1)?.status === 'stuck') {
    return 'STUCK_RECOVERY';
  }

  const rawStatus = String(config.status || 'initialized').toLowerCase();
  if (rawStatus === 'running') {
    return 'ITERATING';
  }
  if (rawStatus === 'complete' || rawStatus === 'completed') {
    return 'COMPLETE';
  }
  return rawStatus.toUpperCase();
}

function formatBlockedByList(blockedBy) {
  return Array.isArray(blockedBy) && blockedBy.length
    ? blockedBy.join(', ')
    : 'unspecified gates';
}

function formatSummaryValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => formatSummaryValue(entry)).join(', ');
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .map((key) => `${key}=${formatSummaryValue(value[key])}`)
      .join(', ');
  }

  return String(value);
}

function summarizeGateResults(gateResults) {
  if (!gateResults || typeof gateResults !== 'object' || !Object.keys(gateResults).length) {
    return 'none recorded';
  }

  return Object.keys(gateResults)
    .sort()
    .map((gateName) => {
      const result = gateResults[gateName];
      if (!result || typeof result !== 'object') {
        return `${gateName}=${formatSummaryValue(result)}`;
      }

      const status = typeof result.pass === 'boolean'
        ? (result.pass ? 'pass' : 'fail')
        : 'unknown';
      const details = Object.keys(result)
        .filter((key) => key !== 'pass' && result[key] !== undefined && result[key] !== null && result[key] !== '')
        .sort()
        .map((key) => `${key}=${formatSummaryValue(result[key])}`);

      return details.length
        ? `${gateName}=${status} (${details.join(', ')})`
        : `${gateName}=${status}`;
    })
    .join('; ');
}

function formatGraphBlocker(blocker) {
  if (!blocker || typeof blocker !== 'object') {
    return formatSummaryValue(blocker);
  }

  const name = typeof blocker.name === 'string' && blocker.name ? blocker.name : 'unnamed-blocker';
  const severity = typeof blocker.severity === 'string' && blocker.severity ? ` (${blocker.severity})` : '';
  const detail = typeof blocker.detail === 'string' && blocker.detail ? blocker.detail : null;

  if (detail) {
    return `${name}${severity}: ${detail}`;
  }

  const extras = Object.keys(blocker)
    .filter((key) => !['name', 'severity', 'detail'].includes(key))
    .sort()
    .map((key) => `${key}=${formatSummaryValue(blocker[key])}`);

  return extras.length ? `${name}${severity}: ${extras.join(', ')}` : `${name}${severity}`;
}

function getTimestampValue(timestamp) {
  const value = Date.parse(timestamp);
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
}

function resolveNextFocus(registry, iterationFiles, iterationRecords) {
  const latestBlockedStop = Array.isArray(registry.blockedStopHistory)
    ? registry.blockedStopHistory.at(-1)
    : null;
  const latestIteration = Array.isArray(iterationRecords) ? iterationRecords.at(-1) : null;

  if (latestBlockedStop) {
    const latestBlockedTimestamp = getTimestampValue(latestBlockedStop.timestamp);
    const latestIterationTimestamp = getTimestampValue(latestIteration?.timestamp);

    if (latestBlockedTimestamp > latestIterationTimestamp) {
      return [
        `BLOCKED on: ${formatBlockedByList(latestBlockedStop.blockedBy)}`,
        `Recovery: ${latestBlockedStop.recoveryStrategy || '[No recovery strategy recorded]'}`,
        'Address the blocking gates before the next iteration.',
      ].join('\n');
    }
  }

  return deriveNextFocusFromContinuity({
    iterationFiles,
    iterationRecords,
    carriedForwardOpenQuestions: registry.carriedForwardOpenQuestions,
    machineOpenQuestions: registry.openQuestions,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function buildRegistry(strategyQuestions, iterationFiles, iterationRecords, eventRecords, reducerState = {}) {
  const questionCoverageRecords = iterationRecords.filter((record) => {
    const status = normalizeText(String(record.status || 'complete')).toLowerCase();
    return !['error', 'failed', 'failure', 'stuck', 'thought'].includes(status);
  });
  const answeredSet = new Set(
    questionCoverageRecords.flatMap((record) => (Array.isArray(record.answeredQuestions) ? record.answeredQuestions : [])).map(normalizeText),
  );

  const keyedQuestions = strategyQuestions.map((question, index) => {
    const normalized = normalizeText(question.text);
    const resolved = question.checked || answeredSet.has(normalized);
    const promotedQuestionId = normalizeQuestionId(question.promotedQuestionId);
    const inboxId = normalizeQuestionId(question.inboxId);
    const injectedAtIteration = normalizeQuestionIteration(question.injectedAtIteration);
    return {
      id: promotedQuestionId || `question-${index + 1}-${slugify(normalized)}`,
      inboxId,
      text: normalized,
      origin: normalizeQuestionOrigin(question.origin),
      source: normalizeQuestionSource(question.source, LEGACY_IMPORT_SOURCE),
      injectedAtIteration,
      promotedQuestionId,
      addedAtIteration: injectedAtIteration,
      resolvedAtIteration: resolved
        ? questionCoverageRecords.find((record) =>
            Array.isArray(record.answeredQuestions)
              && record.answeredQuestions.map(normalizeText).includes(normalized),
          )?.run ?? 0
        : null,
      resolved,
    };
  });

  const keyFindings = uniqueById(
    iterationFiles
      .flatMap((iteration) =>
        iteration.findings.map((finding, index) => ({
          id: `finding-${iteration.run}-${index + 1}-${slugify(finding)}`,
          text: finding,
          addedAtIteration: iteration.run,
          sources: iteration.sources,
        })),
      )
      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
  );

  const ruledOutDirectionCandidates = iterationFiles
    .flatMap((iteration) =>
      iteration.deadEnds.concat(iteration.ruledOut).map((entry) => {
        const hash = contentHash(entry);
        return {
          id: `ruled-out-${hash}`,
          text: entry,
          contentHash: hash,
          addedAtIteration: iteration.run,
        };
      }),
    )
    .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text));
  const ruledOutDirections = uniqueRuledOutByContent(ruledOutDirectionCandidates);

  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
  const convergenceScore =
    latestIteration?.convergenceSignals?.compositeStop
    ?? latestIteration?.newInfoRatio
    ?? 0;
  const blockedStopHistory = eventRecords
    .filter((record) => record.event === 'blocked_stop')
    .map((record) => ({
      run: typeof record.run === 'number' ? record.run : 0,
      blockedBy: Array.isArray(record.blockedBy) ? record.blockedBy : [],
      gateResults: record.gateResults && typeof record.gateResults === 'object' ? record.gateResults : {},
      recoveryStrategy: typeof record.recoveryStrategy === 'string' ? record.recoveryStrategy : '',
      timestamp: typeof record.timestamp === 'string' ? record.timestamp : '',
    }));
  const graphConvergence = buildGraphConvergenceRollup(eventRecords);
  const lineage = reducerState.lineage && typeof reducerState.lineage === 'object'
    ? reducerState.lineage
    : {};
  const openQuestions = keyedQuestions.filter((question) => !question.resolved).map((question) => ({
    id: question.id,
    inboxId: question.inboxId,
    text: question.text,
    origin: question.origin,
    source: question.source,
    injectedAtIteration: question.injectedAtIteration,
    promotedQuestionId: question.promotedQuestionId,
    addedAtIteration: question.addedAtIteration,
    resolvedAtIteration: null,
  }));
  const carriedForwardOpenQuestions = buildCarriedForwardOpenQuestions({
    iterationFiles,
    iterationRecords,
    machineOpenQuestions: openQuestions,
  });
  const uncoveredQuestions = keyedQuestions.filter((question) => !question.resolved).map((question) => question.text);

  return {
    sessionId: lineage.sessionId || '',
    parentSessionId: lineage.parentSessionId ?? null,
    lineageMode: lineage.lineageMode || 'new',
    generation: lineage.generation ?? 1,
    continuedFromRun: lineage.continuedFromRun ?? null,
    terminalStop: reducerState.terminalStop || null,
    keyQuestions: keyedQuestions.map((question) => ({
      id: question.id,
      inboxId: question.inboxId,
      text: question.text,
      origin: question.origin,
      source: question.source,
      injectedAtIteration: question.injectedAtIteration,
      promotedQuestionId: question.promotedQuestionId,
      addedAtIteration: question.addedAtIteration,
      resolvedAtIteration: question.resolvedAtIteration,
      resolved: question.resolved,
    })),
    openQuestions,
    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
      id: question.id,
      inboxId: question.inboxId,
      text: question.text,
      origin: question.origin,
      source: question.source,
      injectedAtIteration: question.injectedAtIteration,
      promotedQuestionId: question.promotedQuestionId,
      addedAtIteration: question.addedAtIteration,
      resolvedAtIteration: question.resolvedAtIteration,
    })),
    carriedForwardOpenQuestions,
    uncoveredQuestions,
    keyFindings,
    ruledOutDirections,
    blockedStopHistory,
    graphConvergenceScore: graphConvergence.graphConvergenceScore,
    graphDecision: graphConvergence.graphDecision,
    graphBlockers: graphConvergence.graphBlockers,
    metrics: {
      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
      carriedForwardOpenQuestions: carriedForwardOpenQuestions.length,
      keyFindings: keyFindings.length,
      convergenceScore,
      coverageBySources,
    },
  };
}

function blockFromBulletList(items) {
  if (!items.length) {
    return '[None yet]';
  }

  return items.map((item) => `- ${item}`).join('\n');
}

function buildExhaustedApproaches(iterationFiles) {
  const grouped = new Map();

  for (const iteration of iterationFiles) {
    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
      const key = entry;
      const bucket = grouped.get(key) || [];
      bucket.push(iteration.run);
      grouped.set(key, bucket);
    }
  }

  if (!grouped.size) {
    return '[No exhausted approach categories yet]';
  }

  const blocked = Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([entry, runs]) => {
      const attemptCount = runs.length;
      const lastRun = Math.max(...runs);
      return [
        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
        `- What was tried: ${entry}`,
        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
        `- Do NOT retry: ${entry}`,
      ].join('\n');
    });

  return blocked.join('\n\n');
}

function buildAnchorSection(anchorId, heading, body) {
  return [
    `<!-- ANCHOR:${anchorId} -->`,
    `## ${heading}`,
    body.trim() ? body.trim() : '[None yet]',
    '',
    `<!-- /ANCHOR:${anchorId} -->`,
  ].join('\n');
}

function replaceAnchorSection(content, anchorId, heading, body) {
  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
  const replacement = buildAnchorSection(anchorId, heading, body);

  if (!pattern.test(content)) {
    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
  }

  return content.replace(pattern, replacement);
}

function upsertAnchorSectionBefore(content, anchorId, heading, body, beforeAnchorId) {
  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
  const replacement = buildAnchorSection(anchorId, heading, body);

  if (pattern.test(content)) {
    return content.replace(pattern, replacement);
  }

  const beforePattern = new RegExp(`\\n?<!-- ANCHOR:${beforeAnchorId} -->`, 'm');
  if (!beforePattern.test(content)) {
    throw new Error(`Missing insertion anchor ${beforeAnchorId} in strategy file`);
  }

  return content.replace(beforePattern, `\n${replacement}\n$&`);
}

function updateStrategyContent(strategyContent, registry, iterationFiles, iterationRecords) {
  const answeredTexts = registry.resolvedQuestions.map((question) => question.text);
  const rewrittenQuestionLines = registry.keyQuestions.map((question) =>
    `- [${question.resolved ? 'x' : ' '}] ${question.text}`,
  );

  const whatWorked = iterationFiles
    .filter((iteration) => iteration.reflectionWorked)
    .map((iteration) => `${iteration.reflectionWorked} (iteration ${iteration.run})`);
  const whatFailed = iterationFiles
    .filter((iteration) => iteration.reflectionFailed)
    .map((iteration) => `${iteration.reflectionFailed} (iteration ${iteration.run})`);
  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);

  let updated = strategyContent;
  updated = replaceAnchorSection(updated, 'key-questions', '3. KEY QUESTIONS (remaining)', rewrittenQuestionLines.join('\n'));
  updated = replaceAnchorSection(updated, 'answered-questions', '6. ANSWERED QUESTIONS', blockFromBulletList(answeredTexts));
  updated = replaceAnchorSection(updated, 'what-worked', '7. WHAT WORKED', blockFromBulletList(whatWorked));
  updated = replaceAnchorSection(updated, 'what-failed', '8. WHAT FAILED', blockFromBulletList(whatFailed));
  updated = replaceAnchorSection(updated, 'exhausted-approaches', '9. EXHAUSTED APPROACHES (do not retry)', buildExhaustedApproaches(iterationFiles));
  updated = replaceAnchorSection(
    updated,
    'ruled-out-directions',
    '10. RULED OUT DIRECTIONS',
    blockFromBulletList(registry.ruledOutDirections.map((entry) => `${entry.text} (iteration ${entry.addedAtIteration})`)),
  );
  updated = upsertAnchorSectionBefore(
    updated,
    'carried-forward-open-questions',
    '11A. CARRIED-FORWARD OPEN QUESTIONS',
    formatCarriedForwardOpenQuestions(registry.carriedForwardOpenQuestions),
    'next-focus',
  );
  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
  return updated;
}

function formatQuestionWithOrigin(question) {
  return question.origin ? `${question.text} [${question.origin}]` : question.text;
}

function renderDashboard(config, registry, iterationRecords, iterationFiles) {
  const latestIteration = iterationRecords.at(-1);
  const terminalStop = registry.terminalStop && typeof registry.terminalStop === 'object'
    ? registry.terminalStop
    : null;
  const sessionId = registry.sessionId || config.lineage?.sessionId || '[Unknown session]';
  const parentSessionId = registry.parentSessionId ?? config.lineage?.parentSessionId ?? 'none';
  const lineageMode = registry.lineageMode || config.lineage?.lineageMode || 'new';
  const generation = registry.generation ?? config.lineage?.generation ?? 1;
  const continuedFromRun = registry.continuedFromRun ?? config.lineage?.continuedFromRun ?? 'none';
  // Exclude "thought" iterations from rolling average — they are analytical-only
  // and produce no evidence, so including them would artificially lower the ratio.
  const evidenceRecords = iterationRecords.filter((record) => record.status !== 'thought');
  const ratios = evidenceRecords
    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
    .filter((value) => value !== null);
  const scores = evidenceRecords
    .map(readIterationScore)
    .filter(isFiniteNumber);
  const ratioSparkline = renderSparkline(ratios);
  const scoreSparkline = renderSparkline(scores);
  const advisoryEvents = Array.isArray(registry.advisoryEvents) ? registry.advisoryEvents : [];
  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
  const showLogRegionColumns = iterationRecords.some(hasLogRegionFields);
  const progressRows = iterationRecords
    .map((record) => {
      const track = record.focusTrack || '-';
      const ratio = typeof record.newInfoRatio === 'number' ? record.newInfoRatio.toFixed(2) : '0.00';
      const baseRow = `| ${record.run} | ${record.focus || 'unknown'} | ${track} | ${ratio} | ${record.findingsCount || 0} | ${record.status || 'complete'} |`;
      return showLogRegionColumns
        ? `${baseRow} ${formatLogRegionNumber(record.logOffset)} | ${formatLogRegionNumber(record.logSize)} | ${formatLogRegionPath(record.logPath)} |`
        : baseRow;
    })
    .join('\n') || (showLogRegionColumns
      ? '| 0 | none yet | - | 0.00 | 0 | initialized | - | - | - |'
      : '| 0 | none yet | - | 0.00 | 0 | initialized |');
  const progressTableHeader = showLogRegionColumns
    ? [
        '| # | Focus | Track | Ratio | Findings | Status | Log Offset | Log Size | Log Path |',
        '|---|-------|-------|-------|----------|--------|------------|----------|----------|',
      ]
    : [
        '| # | Focus | Track | Ratio | Findings | Status |',
        '|---|-------|-------|-------|----------|--------|',
      ];

  return [
    '---',
    'title: Deep Research Dashboard',
    'description: Auto-generated reducer view over the research packet.',
    '---',
    '',
    '# Deep Research Dashboard - Session Overview',
    '',
    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
    '',
    '<!-- ANCHOR:overview -->',
    '## 1. OVERVIEW',
    '',
    'Reducer-generated observability surface for the active research packet.',
    '',
    '<!-- /ANCHOR:overview -->',
    '<!-- ANCHOR:status -->',
    '## 2. STATUS',
    `- Topic: ${config.topic || '[Unknown topic]'}`,
    `- Started: ${config.createdAt || '[Unknown start]'}`,
    `- Status: ${registry.status || String(config.status || 'initialized').toUpperCase()}`,
    `- Iteration: ${registry.metrics.iterationsCompleted} of ${config.maxIterations || 0}`,
    `- Session ID: ${sessionId}`,
    `- Parent Session: ${parentSessionId}`,
    `- Lifecycle Mode: ${lineageMode}`,
    `- Generation: ${generation}`,
    `- continuedFromRun: ${continuedFromRun}`,
    ...(terminalStop?.stopReason ? [`- stopReason: ${terminalStop.stopReason}`] : []),
    '',
    '<!-- /ANCHOR:status -->',
    '<!-- ANCHOR:progress -->',
    '## 3. PROGRESS',
    '',
    ...progressTableHeader,
    progressRows,
    '',
    `- iterationsCompleted: ${registry.metrics.iterationsCompleted}`,
    `- keyFindings: ${registry.metrics.keyFindings}`,
    `- openQuestions: ${registry.metrics.openQuestions}`,
    `- resolvedQuestions: ${registry.metrics.resolvedQuestions}`,
    '',
    '<!-- /ANCHOR:progress -->',
    '<!-- ANCHOR:questions -->',
    '## 4. QUESTIONS',
    `- Answered: ${registry.metrics.resolvedQuestions}/${registry.metrics.resolvedQuestions + registry.metrics.openQuestions}`,
    ...registry.resolvedQuestions.map((question) => `- [x] ${question.text}`),
    ...registry.openQuestions.map((question) => `- [ ] ${formatQuestionWithOrigin(question)}`),
    '',
    '<!-- /ANCHOR:questions -->',
    '<!-- ANCHOR:uncovered-questions -->',
    '## Uncovered Questions',
    `- Count: ${registry.uncoveredQuestions.length}`,
    ...registry.uncoveredQuestions.length
      ? registry.uncoveredQuestions.map((question) => `- [ ] ${question}`)
      : ['- None'],
    '',
    '<!-- /ANCHOR:uncovered-questions -->',
    '<!-- ANCHOR:trend -->',
    '## 5. TREND',
    `- newInfoRatio sparkline: ${ratioSparkline || 'N/A'}`,
    `- score sparkline: ${scoreSparkline || 'N/A'}`,
    `- Last 3 ratios: ${lastThreeRatios}`,
    `- Stuck count: ${iterationRecords.filter((r) => r.status !== 'thought' && r.status !== 'insight' && (r.status === 'stuck' || (typeof r.newInfoRatio === 'number' && r.newInfoRatio === 0))).length}`,
    '- Guard violations: none recorded by the reducer pass',
    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
    ...(advisoryEvents.length
      ? advisoryEvents.map(formatTrendAdvisoryEvent)
      : ['- Advisory events: none']),
    '',
    '<!-- /ANCHOR:trend -->',
    '<!-- ANCHOR:dead-ends -->',
    '## 6. DEAD ENDS',
    ...registry.ruledOutDirections.length
      ? registry.ruledOutDirections.map((entry) => `- ${entry.text} (iteration ${entry.addedAtIteration})`)
      : ['- None yet'],
    '',
    '<!-- /ANCHOR:dead-ends -->',
    '<!-- ANCHOR:next-focus -->',
    '## 7. NEXT FOCUS',
    nextFocus,
    '',
    '<!-- /ANCHOR:next-focus -->',
    '<!-- ANCHOR:active-risks -->',
    '## 8. ACTIVE RISKS',
    ...(latestIteration?.status === 'error'
      ? ['- Latest iteration reported error status.']
      : ['- None active beyond normal research uncertainty.']),
    '',
    '<!-- /ANCHOR:active-risks -->',
    '<!-- ANCHOR:blocked-stops -->',
    '## 9. BLOCKED STOPS',
    ...(registry.blockedStopHistory.length
      ? registry.blockedStopHistory.flatMap((entry) => ([
          `### Iteration ${entry.run} — blocked by [${formatBlockedByList(entry.blockedBy)}]`,
          `- Recovery: ${entry.recoveryStrategy || '[No recovery strategy recorded]'}`,
          `- Gate results: ${summarizeGateResults(entry.gateResults)}`,
          `- Timestamp: ${entry.timestamp || '[Unknown timestamp]'}`,
          '',
        ]))
      : ['No blocked-stop events recorded.', '']),
    '<!-- /ANCHOR:blocked-stops -->',
    '<!-- ANCHOR:graph-convergence -->',
    '## 10. GRAPH CONVERGENCE',
    `- graphConvergenceScore: ${Number.isFinite(registry.graphConvergenceScore) ? registry.graphConvergenceScore.toFixed(2) : '[Not recorded]'}`,
    `- graphDecision: ${registry.graphDecision || '[Not recorded]'}`,
    ...(registry.graphBlockers.length
      ? registry.graphBlockers.map((blocker) => `- Blocker: ${formatGraphBlocker(blocker)}`)
      : ['- graphBlockers: none recorded']),
    '',
    '<!-- /ANCHOR:graph-convergence -->',
    '',
  ].join('\n');
}

/**
 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
 *
 * @param {string} specFolder - Path to the target spec folder for the research packet
 * @param {Object} [options] - Reducer options
 * @param {boolean} [options.write=true] - Write outputs to disk when true
 * @returns {Object} Paths and content for registry, strategy, and dashboard
 */
function reduceResearchState(specFolder, options = {}) {
  const write = options.write !== false;
  const lenient = Boolean(options.lenient);
  const emitResourceMapOutput = Boolean(options.emitResourceMap);
  const requireExistingState = Boolean(options.requireExistingState);
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: researchDir } = resolveArtifactRoot(resolvedSpecFolder, 'research');
  const configPath = path.join(researchDir, 'deep-research-config.json');
  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
  const strategyPath = path.join(researchDir, 'deep-research-strategy.md');
  const registryPath = path.join(researchDir, 'findings-registry.json');
  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
  const resourceMapPath = path.join(researchDir, 'resource-map.md');
  const inboxPath = path.join(researchDir, INBOX_FILE_NAME);
  const iterationDir = path.join(researchDir, 'iterations');
  const deltaDir = path.join(researchDir, 'deltas');

  const config = readJson(configPath);
  const { records: parsedRecords, corruptionWarnings } = readStateLogForReduction(stateLogPath, requireExistingState);
  const records = parsedRecords.filter((record) => record.type === 'iteration');
  const events = parsedRecords.filter((record) => record.type === 'event');
  const strategyContent = readUtf8(strategyPath);
  const strategyQuestions = parseStrategyQuestions(strategyContent);
  const inbox = readInboxQuestions(inboxPath);
  const questionInputs = mergeQuestionSources(strategyQuestions, inbox.questions);
  if (write) {
    warnLegacyImportQuestions(questionInputs);
  }
  for (const warning of inbox.warnings) {
    console.warn(`[deep-research] skipped inbox record: ${warning}`);
  }
  const iterationFiles = fs.existsSync(iterationDir)
    ? fs.readdirSync(iterationDir)
        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
        .sort((a, b) => {
          // Numeric sort on trailing iter number; default .sort() puts iteration-10.md between iteration-1.md and iteration-2.md.
          const numA = parseInt(a.match(/iteration-(\d+)\.md$/)?.[1] ?? '0', 10);
          const numB = parseInt(b.match(/iteration-(\d+)\.md$/)?.[1] ?? '0', 10);
          return numA - numB;
        })
        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
    : [];

  const terminalStop = buildTerminalStopState(parsedRecords);
  const lineage = buildLineageState(config, events);
  config.lineage = {
    ...(config.lineage && typeof config.lineage === 'object' ? config.lineage : {}),
    sessionId: lineage.sessionId,
    parentSessionId: lineage.parentSessionId,
    lineageMode: lineage.lineageMode,
    generation: lineage.generation,
    continuedFromRun: lineage.continuedFromRun,
  };
  const status = deriveDashboardStatus(config, records, events, terminalStop);
  const registry = buildRegistry(questionInputs, iterationFiles, records, events, {
    lineage,
    terminalStop,
    status,
  });
  // Expose corruptionWarnings as a top-level registry field for parity with
  // deep-review.
  registry.corruptionWarnings = corruptionWarnings;
  registry.inboxPath = inboxPath;
  registry.inboxWarnings = inbox.warnings;
  registry.status = status;
  const evidenceRecords = records.filter((record) => record.status !== 'thought');
  const ratioHistory = evidenceRecords
    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
    .filter((value) => value !== null);
  const scoreHistory = evidenceRecords
    .map(readIterationScore)
    .filter(isFiniteNumber);
  registry.advisoryEvents = buildTrendFlatlineAdvisories(config, {
    newInfoRatio: ratioHistory,
    score: scoreHistory,
  }, evidenceRecords.at(-1));
  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, records);
  const dashboard = renderDashboard(config, registry, records, iterationFiles);
  let resourceMap = null;
  let resourceMapSkipped = true;
  let resourceMapSkipReason = null;

  if (corruptionWarnings.length > 0 && !lenient) {
    throw createCorruptionError(stateLogPath, corruptionWarnings);
  }

  if (emitResourceMapOutput) {
    if (getResourceMapEmitSetting(config) === false) {
      resourceMapSkipReason = 'config.resource_map.emit=false';
    } else {
      const deltaPayloads = loadDeltaPayloads(deltaDir);
      if (!deltaPayloads.length) {
        resourceMapSkipReason = 'no delta files found';
      } else {
        resourceMap = emitResourceMap({
          shape: 'research',
          deltas: deltaPayloads,
          packet: {
            title: config.topic || path.basename(resolvedSpecFolder),
            specFolder: resolvedSpecFolder,
          },
          scope: `research convergence output for ${path.basename(resolvedSpecFolder)}`,
          createdAt: new Date().toISOString(),
        });
        resourceMapSkipped = false;
      }
    }
  }

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
    writeUtf8(dashboardPath, dashboard);
    if (emitResourceMapOutput && resourceMap) {
      writeUtf8(resourceMapPath, resourceMap);
    }
  }

  return {
    configPath,
    stateLogPath,
    strategyPath,
    registryPath,
    dashboardPath,
    resourceMapPath,
    registry,
    strategy,
    dashboard,
    resourceMap,
    resourceMapSkipped,
    resourceMapSkipReason,
    corruptionWarnings,
    hasCorruption: corruptionWarnings.length > 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const lenient = args.includes('--lenient');
  const emitResourceMapOutput = args.includes('--emit-resource-map');
  const requireExistingState = args.includes('--require-existing-state');
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const specFolder = positional[0];

  if (!specFolder) {
    process.stderr.write(
      'Usage: node .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs <spec-folder> [--lenient] [--emit-resource-map]\n',
    );
    process.exit(1);
  }

  try {
    const result = reduceResearchState(specFolder, {
      write: true,
      lenient,
      emitResourceMap: emitResourceMapOutput,
      requireExistingState,
    });
    process.stdout.write(
      `${JSON.stringify(
        {
          registryPath: result.registryPath,
          dashboardPath: result.dashboardPath,
          strategyPath: result.strategyPath,
          iterationsCompleted: result.registry.metrics.iterationsCompleted,
          corruptionCount: result.corruptionWarnings.length,
          resourceMapPath: emitResourceMapOutput ? result.resourceMapPath : null,
          resourceMapSkipped: emitResourceMapOutput ? result.resourceMapSkipped : null,
          resourceMapSkipReason: emitResourceMapOutput ? result.resourceMapSkipReason : null,
        },
        null,
        2,
      )}\n`,
    );
    // Fail-closed exit semantics matching deep-review.
    if (result.hasCorruption && !lenient) {
      process.exit(2);
    }
  } catch (error) {
    if (error && error.code === 'STATE_RECOVERY_REFUSED') {
      process.stderr.write(`${error.message}\n`);
      process.exit(2);
    }
    if (error && error.code === 'STATE_CORRUPTION') {
      process.stderr.write(`${error.message}\n`);
      process.exit(2);
    }
    process.stderr.write(`[deep-research] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildGraphConvergenceRollup,
  buildLineageState,
  buildTerminalStopState,
  computeGraphConvergenceScore,
  deriveDashboardStatus,
  parseIterationFile,
  parseJsonl,
  parseJsonlDetailed,
  reduceResearchState,
  renderSparkline,
  readStateLogForReduction,
};
