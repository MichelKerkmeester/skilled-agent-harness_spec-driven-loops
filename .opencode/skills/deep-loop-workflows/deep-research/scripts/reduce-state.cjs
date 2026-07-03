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
const { filterCompletionBearingRecords } = require('../../shared/progress/progress-record.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SPARKLINE_WIDTH = 20;
const DEFAULT_TREND_FLATLINE_WINDOW = 3;
const DEFAULT_REJECTED_PATTERN_CATEGORY = 'general';
const DEFAULT_REJECTED_PATTERN_FUZZY_THRESHOLD = 0.85;
const DEFAULT_MIN_IDEA_OBSERVATIONS = 2;
const MIN_IDEA_OBSERVATIONS = 1;
const MAX_IDEA_OBSERVATIONS = 10;
const INBOX_FILE_NAME = 'inbox.jsonl';
const DEFAULT_INBOX_SOURCE = 'research-inbox';
const LEGACY_IMPORT_ORIGIN = 'legacy-import';
const LEGACY_IMPORT_SOURCE = 'key-questions';
const QUESTION_CONFLICT_EVENT = 'question_conflict';
const DEFAULT_QUESTION_DECISION = 'needs_decision';
const MAX_REJECTED_PATTERNS = 100;
const REJECTED_PATTERN_CANDIDATE_FIELDS = ['text', 'focus', 'nextFocus', 'pattern', 'idea', 'title'];
const REJECTED_PATTERN_EVENT_FIELDS = ['pattern', 'idea', 'text', 'candidate'];
const IDEA_EVENT_TEXT_FIELDS = ['idea', 'text', 'title', 'pattern', 'candidate'];
const IDEA_OBSERVED_EVENTS = new Set(['idea_observed', 'ideaObserved']);
const IDEA_PROMOTED_EVENTS = new Set(['idea_promoted', 'ideaPromoted']);
const IDEA_REJECTED_EVENTS = new Set(['idea_rejected', 'ideaRejected']);
const IDEA_REJECTED_REMOVED_EVENTS = new Set(['idea_rejected_removed', 'ideaRejectedRemoved']);
const IDEA_REJECTED_RESET_EVENTS = new Set(['idea_rejected_reset', 'ideaRejectedReset']);
const VALID_QUESTION_ORIGINS = new Set([
  'angle-bank',
  'analyst-strategy',
  'operator',
  LEGACY_IMPORT_ORIGIN,
]);
const VALID_QUESTION_DECISIONS = new Set([
  'accepted',
  'rejected',
  'superseded',
  DEFAULT_QUESTION_DECISION,
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

function normalizeQuestionDecision(value) {
  const decision = normalizeOptionalText(value).toLowerCase();
  return VALID_QUESTION_DECISIONS.has(decision) ? decision : null;
}

function contentHash(value) {
  return crypto
    .createHash('sha256')
    .update(normalizeText(String(value)).toLowerCase())
    .digest('hex')
    .slice(0, 12);
}

function normalizeRejectedPatternKey(value) {
  return normalizeText(String(value ?? ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeRejectedPatternCategory(value) {
  const normalized = normalizeOptionalText(value).toLowerCase();
  return normalized || DEFAULT_REJECTED_PATTERN_CATEGORY;
}

function normalizeRejectedPatternId(value) {
  const normalized = normalizeOptionalText(value);
  return normalized || null;
}

function isNamedEvent(record, eventNames) {
  return record
    && record.type === 'event'
    && typeof record.event === 'string'
    && eventNames.has(record.event);
}

function readFirstTextField(record, fields) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return '';
  }

  for (const field of fields) {
    const value = normalizeOptionalText(record[field]);
    if (value) {
      return value;
    }
  }
  return '';
}

function readRejectedPatternText(record) {
  return readFirstTextField(record, REJECTED_PATTERN_EVENT_FIELDS);
}

function readCandidateText(candidate) {
  if (typeof candidate === 'string') {
    return normalizeOptionalText(candidate);
  }
  return readFirstTextField(candidate, REJECTED_PATTERN_CANDIDATE_FIELDS);
}

function readCandidateCategory(candidate, fallbackCategory) {
  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
    return normalizeRejectedPatternCategory(candidate.category ?? fallbackCategory);
  }
  return normalizeRejectedPatternCategory(fallbackCategory);
}

function isRejectedPatternCategoryCompatible(rejectedCategory, candidateCategory) {
  const rejected = normalizeRejectedPatternCategory(rejectedCategory);
  const candidate = normalizeRejectedPatternCategory(candidateCategory);
  return rejected === candidate
    || rejected === DEFAULT_REJECTED_PATTERN_CATEGORY
    || candidate === DEFAULT_REJECTED_PATTERN_CATEGORY;
}

function resolveRejectedPatternFuzzyThreshold(config) {
  const rawThreshold =
    config?.rejectedPatternFuzzyThreshold
    ?? config?.rejectedPatterns?.fuzzyThreshold
    ?? DEFAULT_REJECTED_PATTERN_FUZZY_THRESHOLD;
  return typeof rawThreshold === 'number' && Number.isFinite(rawThreshold) && rawThreshold >= 0 && rawThreshold <= 1
    ? rawThreshold
    : DEFAULT_REJECTED_PATTERN_FUZZY_THRESHOLD;
}

function normalizeRejectedPatternEvent(record) {
  const pattern = readRejectedPatternText(record);
  const normalizedPattern = normalizeRejectedPatternKey(pattern);
  if (!normalizedPattern) {
    return null;
  }

  const category = normalizeRejectedPatternCategory(record.category);
  return {
    id: normalizeRejectedPatternId(record.rejectedId ?? record.ideaId ?? record.id)
      || `rejected-${category}-${contentHash(normalizedPattern)}`,
    ideaId: normalizeRejectedPatternId(record.ideaId),
    pattern,
    normalizedPattern,
    category,
    reason: normalizeOptionalText(record.reason),
    addedAtRun: isFiniteNumber(record.run) ? record.run : null,
    timestamp: normalizeOptionalText(record.timestamp),
    sessionId: normalizeRejectedPatternId(record.sessionId),
    generation: isFiniteNumber(record.generation) ? record.generation : null,
  };
}

function removeRejectedPatternEntries(entries, record) {
  const rejectedId = normalizeRejectedPatternId(record.rejectedId ?? record.ideaId ?? record.id);
  const patternKey = normalizeRejectedPatternKey(readRejectedPatternText(record));
  const rawCategory = normalizeOptionalText(record.category);
  const category = rawCategory ? normalizeRejectedPatternCategory(rawCategory) : null;

  return entries.filter((entry) => {
    if (rejectedId && (entry.id === rejectedId || entry.ideaId === rejectedId)) {
      return false;
    }
    if (!patternKey || entry.normalizedPattern !== patternKey) {
      return true;
    }
    return category ? entry.category !== category : false;
  });
}

/**
 * Derive the active rejected-pattern cache from append-only research events.
 *
 * @param {Array<Object>} eventRecords - Parsed JSONL event records.
 * @param {Object} [options] - Index options.
 * @param {number} [options.fuzzyThreshold=0.85] - Similarity threshold used by candidate checks.
 * @returns {{entries: Array<Object>, maxEntries: number, fuzzyThreshold: number, warnings: string[]}} Bounded rejected-pattern index.
 */
function deriveRejectedPatternIndex(eventRecords, options = {}) {
  const fuzzyThreshold = typeof options.fuzzyThreshold === 'number'
    ? options.fuzzyThreshold
    : DEFAULT_REJECTED_PATTERN_FUZZY_THRESHOLD;
  const entries = [];
  const warnings = [];

  for (const record of Array.isArray(eventRecords) ? eventRecords : []) {
    if (!record || record.type !== 'event') {
      continue;
    }

    if (isNamedEvent(record, IDEA_REJECTED_RESET_EVENTS)) {
      entries.length = 0;
      continue;
    }

    if (isNamedEvent(record, IDEA_REJECTED_REMOVED_EVENTS)) {
      const nextEntries = removeRejectedPatternEntries(entries, record);
      entries.length = 0;
      entries.push(...nextEntries);
      continue;
    }

    if (!isNamedEvent(record, IDEA_REJECTED_EVENTS)) {
      continue;
    }

    const entry = normalizeRejectedPatternEvent(record);
    if (!entry) {
      continue;
    }

    const replacedEntries = entries.filter((existing) =>
      existing.id !== entry.id
      && !(existing.category === entry.category && existing.normalizedPattern === entry.normalizedPattern),
    );
    replacedEntries.push(entry);
    entries.length = 0;
    entries.push(...replacedEntries);

    while (entries.length > MAX_REJECTED_PATTERNS) {
      const evicted = entries.shift();
      warnings.push(
        `[deep-research] evicted rejected pattern "${evicted.pattern}" from bounded rejected-pattern cache (max ${MAX_REJECTED_PATTERNS})`,
      );
    }
  }

  return {
    entries,
    maxEntries: MAX_REJECTED_PATTERNS,
    fuzzyThreshold,
    warnings,
  };
}

function calculateLevenshteinDistance(left, right) {
  if (left === right) {
    return 0;
  }
  if (!left.length) {
    return right.length;
  }
  if (!right.length) {
    return left.length;
  }

  const previous = Array.from({ length: right.length + 1 }, (_unused, index) => index);
  const current = new Array(right.length + 1);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function calculateRejectedPatternSimilarity(left, right) {
  const normalizedLeft = normalizeRejectedPatternKey(left).slice(0, 500);
  const normalizedRight = normalizeRejectedPatternKey(right).slice(0, 500);
  if (!normalizedLeft || !normalizedRight) {
    return 0;
  }
  if (normalizedLeft === normalizedRight) {
    return 1;
  }

  const distance = calculateLevenshteinDistance(normalizedLeft, normalizedRight);
  return 1 - (distance / Math.max(normalizedLeft.length, normalizedRight.length));
}

function readRejectedEntries(rejectedIndex) {
  if (Array.isArray(rejectedIndex)) {
    return rejectedIndex;
  }
  return Array.isArray(rejectedIndex?.entries) ? rejectedIndex.entries : [];
}

function resolveCandidateThreshold(rejectedIndex, options) {
  const threshold = options?.fuzzyThreshold ?? rejectedIndex?.fuzzyThreshold ?? rejectedIndex?.threshold;
  return typeof threshold === 'number' && Number.isFinite(threshold) && threshold >= 0 && threshold <= 1
    ? threshold
    : DEFAULT_REJECTED_PATTERN_FUZZY_THRESHOLD;
}

/**
 * Find the active rejected pattern that suppresses a candidate, if any.
 *
 * @param {string|Object} candidate - Candidate text or structured candidate.
 * @param {Object|Array<Object>} rejectedIndex - Derived rejected-pattern index.
 * @param {Object} [options] - Match options.
 * @param {string} [options.category="general"] - Candidate category.
 * @returns {Object|null} Match metadata when the candidate is suppressed.
 */
function findRejectedPatternMatch(candidate, rejectedIndex, options = {}) {
  const candidateText = readCandidateText(candidate);
  const candidateKey = normalizeRejectedPatternKey(candidateText);
  if (!candidateKey) {
    return null;
  }

  const candidateCategory = readCandidateCategory(candidate, options.category);
  const fuzzyThreshold = resolveCandidateThreshold(rejectedIndex, options);
  let bestFuzzyMatch = null;

  for (const entry of readRejectedEntries(rejectedIndex)) {
    const rejectedPattern = entry.pattern || entry.text || '';
    const rejectedKey = entry.normalizedPattern || normalizeRejectedPatternKey(rejectedPattern);
    const rejectedCategory = normalizeRejectedPatternCategory(entry.category);
    if (!rejectedKey || !isRejectedPatternCategoryCompatible(rejectedCategory, candidateCategory)) {
      continue;
    }

    if (rejectedKey === candidateKey) {
      return {
        candidateText,
        candidateCategory,
        matchType: 'exact',
        similarity: 1,
        rejectedPattern: {
          ...entry,
          pattern: rejectedPattern,
          normalizedPattern: rejectedKey,
          category: rejectedCategory,
        },
      };
    }

    const similarity = calculateRejectedPatternSimilarity(candidateKey, rejectedKey);
    if (similarity < fuzzyThreshold) {
      continue;
    }
    if (!bestFuzzyMatch || similarity > bestFuzzyMatch.similarity) {
      bestFuzzyMatch = {
        candidateText,
        candidateCategory,
        matchType: 'fuzzy',
        similarity,
        rejectedPattern: {
          ...entry,
          pattern: rejectedPattern,
          normalizedPattern: rejectedKey,
          category: rejectedCategory,
        },
      };
    }
  }

  return bestFuzzyMatch;
}

/**
 * Remove rejected ideas from candidate lists while preserving input order.
 *
 * @param {Array<string|Object>} candidates - Candidate ideas or focus records.
 * @param {Object|Array<Object>} rejectedIndex - Derived rejected-pattern index.
 * @param {Object} [options] - Match options.
 * @returns {{accepted: Array<string|Object>, suppressed: Array<Object>}} Accepted candidates and suppression diagnostics.
 */
function filterRejectedIdeaCandidates(candidates, rejectedIndex, options = {}) {
  const accepted = [];
  const suppressed = [];

  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    const match = findRejectedPatternMatch(candidate, rejectedIndex, options);
    if (!match) {
      accepted.push(candidate);
      continue;
    }

    suppressed.push({
      candidate,
      candidateText: match.candidateText,
      category: match.candidateCategory,
      matchType: match.matchType,
      similarity: match.similarity,
      rejectedPattern: match.rejectedPattern.pattern,
      rejectedPatternId: match.rejectedPattern.id,
      rejectedPatternCategory: match.rejectedPattern.category,
    });
  }

  return { accepted, suppressed };
}

function serializeRejectedPatternEntry(entry) {
  return {
    id: entry.id,
    ideaId: entry.ideaId,
    pattern: entry.pattern,
    category: entry.category,
    reason: entry.reason,
    addedAtRun: entry.addedAtRun,
    timestamp: entry.timestamp,
    sessionId: entry.sessionId,
    generation: entry.generation,
  };
}

function resolveMinIdeaObservations(config) {
  const rawValue = config?.minIdeaObservations
    ?? config?.ideasBacklog?.minIdeaObservations
    ?? DEFAULT_MIN_IDEA_OBSERVATIONS;
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue)) {
    return DEFAULT_MIN_IDEA_OBSERVATIONS;
  }
  return Math.min(
    MAX_IDEA_OBSERVATIONS,
    Math.max(MIN_IDEA_OBSERVATIONS, Math.floor(numericValue)),
  );
}

function normalizeIdeaCategory(value) {
  const normalized = normalizeOptionalText(value).toLowerCase();
  return normalized || 'ideas';
}

function readIdeaText(record) {
  return readFirstTextField(record, IDEA_EVENT_TEXT_FIELDS);
}

function normalizeIdeaId(value, idea, category) {
  const normalized = normalizeOptionalText(value);
  if (normalized) {
    return normalized;
  }
  return `idea-${category}-${contentHash(idea)}`;
}

function normalizeIdeaObservationEvent(record) {
  const idea = readIdeaText(record);
  if (!idea) {
    return null;
  }

  const category = normalizeIdeaCategory(record.category);
  const run = isFiniteNumber(record.run) ? record.run : null;
  return {
    id: normalizeIdeaId(record.ideaId ?? record.id, idea, category),
    idea,
    category,
    run,
    timestamp: normalizeOptionalText(record.timestamp),
    source: normalizeOptionalText(record.source),
    sessionId: normalizeRejectedPatternId(record.sessionId),
    generation: isFiniteNumber(record.generation) ? record.generation : null,
  };
}

function mergeIdeaObservation(existing, observation) {
  if (!existing) {
    return {
      id: observation.id,
      idea: observation.idea,
      category: observation.category,
      observationCount: 1,
      firstObservedRun: observation.run,
      lastObservedRun: observation.run,
      firstObservedAt: observation.timestamp || null,
      lastObservedAt: observation.timestamp || null,
      sources: observation.source ? [observation.source] : [],
      sessionId: observation.sessionId,
      generation: observation.generation,
    };
  }

  const sources = new Set(existing.sources);
  if (observation.source) {
    sources.add(observation.source);
  }

  return {
    ...existing,
    observationCount: existing.observationCount + 1,
    lastObservedRun: observation.run ?? existing.lastObservedRun,
    lastObservedAt: observation.timestamp || existing.lastObservedAt,
    sources: Array.from(sources),
  };
}

function isIdeaSuppressed(idea, rejectedIndex) {
  for (const entry of readRejectedEntries(rejectedIndex)) {
    if (entry.ideaId && entry.ideaId === idea.id) {
      return {
        candidateText: idea.idea,
        category: idea.category,
        matchType: 'id',
        similarity: 1,
        rejectedPattern: entry.pattern,
        rejectedPatternId: entry.id,
        rejectedPatternCategory: entry.category,
      };
    }
  }

  const match = findRejectedPatternMatch(
    { text: idea.idea, category: idea.category },
    rejectedIndex,
    { category: idea.category },
  );
  return match
    ? {
        candidateText: match.candidateText,
        category: match.candidateCategory,
        matchType: match.matchType,
        similarity: match.similarity,
        rejectedPattern: match.rejectedPattern.pattern,
        rejectedPatternId: match.rejectedPattern.id,
        rejectedPatternCategory: match.rejectedPattern.category,
      }
    : null;
}

function rankPromotedIdeas(ideas) {
  return ideas
    .slice()
    .sort((left, right) =>
      right.observationCount - left.observationCount
      || (right.lastObservedRun ?? 0) - (left.lastObservedRun ?? 0)
      || (left.firstObservedRun ?? 0) - (right.firstObservedRun ?? 0)
      || left.idea.localeCompare(right.idea),
    )
    .map((idea, index) => ({
      ...idea,
      rank: index + 1,
    }));
}

function deriveIdeaBacklog(eventRecords, options = {}) {
  const minIdeaObservations = resolveMinIdeaObservations(options);
  const rejectedIndex = options.rejectedIndex || { entries: [] };
  const byIdeaId = new Map();

  for (const record of Array.isArray(eventRecords) ? eventRecords : []) {
    if (!isNamedEvent(record, IDEA_OBSERVED_EVENTS)) {
      continue;
    }

    const observation = normalizeIdeaObservationEvent(record);
    if (!observation) {
      continue;
    }

    byIdeaId.set(
      observation.id,
      mergeIdeaObservation(byIdeaId.get(observation.id), observation),
    );
  }

  const observedIdeas = Array.from(byIdeaId.values())
    .sort((left, right) =>
      (left.firstObservedRun ?? 0) - (right.firstObservedRun ?? 0)
      || left.idea.localeCompare(right.idea),
    );
  const promotionCandidates = observedIdeas
    .filter((idea) => idea.observationCount >= minIdeaObservations);
  const suppressedIdeas = [];
  const promotableIdeas = [];

  for (const idea of promotionCandidates) {
    const suppression = isIdeaSuppressed(idea, rejectedIndex);
    if (suppression) {
      suppressedIdeas.push({
        id: idea.id,
        idea: idea.idea,
        observationCount: idea.observationCount,
        ...suppression,
      });
      continue;
    }
    promotableIdeas.push(idea);
  }

  return {
    minIdeaObservations,
    observedIdeas,
    promotedIdeas: rankPromotedIdeas(promotableIdeas),
    suppressedIdeas,
  };
}

function buildIdeaPromotionEvents(promotedIdeas, eventRecords, context = {}) {
  const existingPromotedIdeaIds = new Set(
    eventRecords
      .filter((record) => isNamedEvent(record, IDEA_PROMOTED_EVENTS))
      .map((record) => normalizeIdeaId(record.ideaId ?? record.id, readIdeaText(record), normalizeIdeaCategory(record.category)))
      .filter(Boolean),
  );

  return promotedIdeas
    .filter((idea) => !existingPromotedIdeaIds.has(idea.id))
    .map((idea) => ({
      type: 'event',
      event: 'idea_promoted',
      mode: 'research',
      run: context.run ?? idea.lastObservedRun ?? null,
      ideaId: idea.id,
      idea: idea.idea,
      category: idea.category,
      observationCount: idea.observationCount,
      minIdeaObservations: context.minIdeaObservations ?? null,
      firstObservedRun: idea.firstObservedRun,
      lastObservedRun: idea.lastObservedRun,
      timestamp: context.timestamp || new Date().toISOString(),
      sessionId: context.sessionId ?? idea.sessionId ?? null,
      generation: context.generation ?? idea.generation ?? null,
    }));
}

function appendIdeaPromotionEvents(stateLogPath, promotedIdeas, eventRecords, context = {}) {
  const rows = buildIdeaPromotionEvents(promotedIdeas, eventRecords, context);
  if (rows.length) {
    fs.appendFileSync(stateLogPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
  }
  return rows;
}

function uniqueSuppressedCandidates(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = [
      normalizeRejectedPatternKey(item.candidateText),
      normalizeRejectedPatternCategory(item.category),
      item.rejectedPatternId || normalizeRejectedPatternKey(item.rejectedPattern),
      item.matchType,
    ].join('\0');
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }
  return result;
}

function filterItemTextField(items, field, rejectedIndex, category) {
  return items.map((item) => {
    if (!Array.isArray(item?.[field])) {
      return item;
    }

    const candidates = item[field].map((text) => ({ text, category }));
    const { accepted } = filterRejectedIdeaCandidates(candidates, rejectedIndex, { category });
    if (accepted.length === item[field].length) {
      return item;
    }

    return {
      ...item,
      [field]: accepted.map((candidate) => candidate.text),
    };
  });
}

function buildSuppressedNextFocusCandidates({
  openQuestions,
  carriedForwardOpenQuestions,
  promotedIdeas,
  iterationFiles,
  iterationRecords,
  blockedStopHistory,
  rejectedIndex,
}) {
  const suppressed = [];
  suppressed.push(...filterRejectedIdeaCandidates(openQuestions, rejectedIndex, { category: 'next-focus' }).suppressed);
  suppressed.push(...filterRejectedIdeaCandidates(carriedForwardOpenQuestions, rejectedIndex, { category: 'next-focus' }).suppressed);
  suppressed.push(...filterRejectedIdeaCandidates(
    (Array.isArray(promotedIdeas) ? promotedIdeas : []).map((idea) => ({
      text: idea.idea,
      category: idea.category || 'ideas',
      ideaId: idea.id,
    })),
    rejectedIndex,
    { category: 'ideas' },
  ).suppressed);
  suppressed.push(...iterationFiles.flatMap((iteration) =>
    filterRejectedIdeaCandidates(
      iteration.findings.map((text) => ({ text, category: 'next-focus', run: iteration.run, source: 'iteration-finding' })),
      rejectedIndex,
      { category: 'next-focus' },
    ).suppressed,
  ));
  suppressed.push(...iterationRecords.flatMap((record) =>
    filterRejectedIdeaCandidates(
      (Array.isArray(record.findings) ? record.findings : []).map((text) => ({
        text,
        category: 'next-focus',
        run: record.run,
        source: 'iteration-record-finding',
      })),
      rejectedIndex,
      { category: 'next-focus' },
    ).suppressed,
  ));
  suppressed.push(...filterRejectedIdeaCandidates(
    blockedStopHistory
      .map((entry) => entry.recoveryStrategy)
      .filter(Boolean)
      .map((text) => ({ text, category: 'recovery' })),
    rejectedIndex,
    { category: 'recovery' },
  ).suppressed);

  return uniqueSuppressedCandidates(suppressed);
}

function filterNextFocusInputs(registry, iterationFiles, iterationRecords) {
  const rejectedIndex = registry.rejectedPatternIndex;
  if (!readRejectedEntries(rejectedIndex).length) {
    return {
      openQuestions: registry.openQuestions,
      carriedForwardOpenQuestions: registry.carriedForwardOpenQuestions,
      iterationFiles,
      iterationRecords,
    };
  }

  return {
    openQuestions: filterRejectedIdeaCandidates(registry.openQuestions, rejectedIndex, { category: 'next-focus' }).accepted,
    carriedForwardOpenQuestions: filterRejectedIdeaCandidates(
      registry.carriedForwardOpenQuestions,
      rejectedIndex,
      { category: 'next-focus' },
    ).accepted,
    iterationFiles: filterItemTextField(iterationFiles, 'findings', rejectedIndex, 'next-focus'),
    iterationRecords: filterItemTextField(iterationRecords, 'findings', rejectedIndex, 'next-focus'),
  };
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

function readPriorQuestionRegistry(...registryPaths) {
  for (const registryPath of registryPaths) {
    if (!fs.existsSync(registryPath)) {
      continue;
    }

    try {
      return readJson(registryPath);
    } catch (error) {
      console.warn(
        `[deep-research] ignored unreadable prior question registry: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return null;
}

function normalizeRegistryQuestion(question, index) {
  if (!question || typeof question !== 'object' || Array.isArray(question)) {
    return null;
  }

  const text = normalizeOptionalText(question.text);
  if (!text) {
    return null;
  }

  const promotedQuestionId = normalizeQuestionId(question.promotedQuestionId);
  const inboxId = normalizeQuestionId(question.inboxId);
  const id = normalizeQuestionId(question.id)
    || promotedQuestionId
    || `question-${index + 1}-${slugify(text)}`;
  const operatorDecision = normalizeQuestionDecision(question.operatorDecision)
    || normalizeQuestionDecision(question.questionDecision);

  return {
    checked: Boolean(question.checked || question.resolved),
    id,
    inboxId,
    text,
    origin: normalizeQuestionOrigin(question.origin),
    source: normalizeQuestionSource(question.source, LEGACY_IMPORT_SOURCE),
    injectedAtIteration: normalizeQuestionIteration(question.injectedAtIteration ?? question.addedAtIteration),
    promotedQuestionId,
    ...(operatorDecision ? { operatorDecision } : {}),
  };
}

function collectPriorRegistryQuestions(registry) {
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    return [];
  }

  const candidates = [];
  for (const key of ['keyQuestions', 'openQuestions', 'resolvedQuestions']) {
    if (Array.isArray(registry[key])) {
      candidates.push(...registry[key]);
    }
  }

  const seen = new Set();
  const questions = [];
  for (const candidate of candidates) {
    const question = normalizeRegistryQuestion(candidate, questions.length);
    if (!question) {
      continue;
    }

    const key = question.id || question.inboxId || contentHash(question.text);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    questions.push(question);
  }
  return questions;
}

function indexCanonicalQuestions(questions) {
  const byId = new Map();
  const byInboxId = new Map();
  const byText = new Map();

  questions.forEach((question, index) => {
    if (question.id) {
      byId.set(question.id, index);
    }
    if (question.promotedQuestionId) {
      byId.set(question.promotedQuestionId, index);
    }
    if (question.inboxId) {
      byInboxId.set(question.inboxId, index);
    }
    byText.set(contentHash(question.text), index);
  });

  return { byId, byInboxId, byText };
}

function findCanonicalQuestionIndex(index, question) {
  const promotedQuestionId = normalizeQuestionId(question.promotedQuestionId);
  if (promotedQuestionId && index.byId.has(promotedQuestionId)) {
    return index.byId.get(promotedQuestionId);
  }

  const id = normalizeQuestionId(question.id);
  if (id && index.byId.has(id)) {
    return index.byId.get(id);
  }

  const inboxId = normalizeQuestionId(question.inboxId);
  if (inboxId && index.byInboxId.has(inboxId)) {
    return index.byInboxId.get(inboxId);
  }

  const text = normalizeOptionalText(question.text);
  if (text) {
    return index.byText.get(contentHash(text));
  }

  return undefined;
}

function buildQuestionConflict(registryQuestion, inboxQuestion, operatorDecision) {
  const registryValue = normalizeText(registryQuestion.text);
  const inboxValue = normalizeText(inboxQuestion.text);
  const questionId = normalizeQuestionId(registryQuestion.id)
    || normalizeQuestionId(inboxQuestion.promotedQuestionId)
    || `question-${contentHash(registryValue)}`;
  const inboxId = normalizeQuestionId(inboxQuestion.inboxId);
  const conflictId = `question-conflict-${contentHash([
    questionId,
    inboxId || '',
    registryValue,
    inboxValue,
  ].join('|'))}`;

  return {
    conflictId,
    questionId,
    inboxId,
    operatorDecision,
    registryValue,
    inboxValue,
    source: normalizeQuestionSource(inboxQuestion.source, DEFAULT_INBOX_SOURCE),
    origin: normalizeQuestionOrigin(inboxQuestion.origin),
    injectedAtIteration: normalizeQuestionIteration(inboxQuestion.injectedAtIteration),
  };
}

function updateIndexedQuestion(questions, index, questionIndex, nextQuestion) {
  const previous = questions[questionIndex];
  if (previous.id) {
    index.byId.delete(previous.id);
  }
  if (previous.promotedQuestionId) {
    index.byId.delete(previous.promotedQuestionId);
  }
  if (previous.inboxId) {
    index.byInboxId.delete(previous.inboxId);
  }
  index.byText.delete(contentHash(previous.text));

  questions[questionIndex] = nextQuestion;
  if (nextQuestion.id) {
    index.byId.set(nextQuestion.id, questionIndex);
  }
  if (nextQuestion.promotedQuestionId) {
    index.byId.set(nextQuestion.promotedQuestionId, questionIndex);
  }
  if (nextQuestion.inboxId) {
    index.byInboxId.set(nextQuestion.inboxId, questionIndex);
  }
  index.byText.set(contentHash(nextQuestion.text), questionIndex);
}

function addIndexedQuestion(questions, index, question) {
  const questionIndex = questions.length;
  questions.push(question);
  if (question.id) {
    index.byId.set(question.id, questionIndex);
  }
  if (question.promotedQuestionId) {
    index.byId.set(question.promotedQuestionId, questionIndex);
  }
  if (question.inboxId) {
    index.byInboxId.set(question.inboxId, questionIndex);
  }
  index.byText.set(contentHash(question.text), questionIndex);
}

function mergeQuestionMetadata(existing, incoming) {
  return {
    ...existing,
    inboxId: existing.inboxId || normalizeQuestionId(incoming.inboxId),
    source: existing.source || normalizeQuestionSource(incoming.source, DEFAULT_INBOX_SOURCE),
    origin: existing.origin || normalizeQuestionOrigin(incoming.origin),
    injectedAtIteration: existing.injectedAtIteration || normalizeQuestionIteration(incoming.injectedAtIteration),
    promotedQuestionId: existing.promotedQuestionId || normalizeQuestionId(incoming.promotedQuestionId),
  };
}

function applyQuestionConflictDecision(registryQuestion, inboxQuestion, operatorDecision, conflict) {
  if (operatorDecision === 'accepted') {
    return {
      ...registryQuestion,
      ...inboxQuestion,
      id: registryQuestion.id,
      text: normalizeText(inboxQuestion.text),
      checked: Boolean(registryQuestion.checked || inboxQuestion.checked),
      inboxId: normalizeQuestionId(inboxQuestion.inboxId) || registryQuestion.inboxId,
      promotedQuestionId: normalizeQuestionId(inboxQuestion.promotedQuestionId) || registryQuestion.promotedQuestionId,
      operatorDecision,
      conflictId: conflict.conflictId,
    };
  }

  return {
    ...mergeQuestionMetadata(registryQuestion, inboxQuestion),
    operatorDecision,
    conflictId: conflict.conflictId,
  };
}

function buildQuestionFields(question) {
  return {
    id: question.id,
    inboxId: question.inboxId,
    text: question.text,
    origin: question.origin,
    source: question.source,
    injectedAtIteration: question.injectedAtIteration,
    promotedQuestionId: question.promotedQuestionId,
    addedAtIteration: question.addedAtIteration,
    resolvedAtIteration: question.resolvedAtIteration,
    ...(question.operatorDecision ? { operatorDecision: question.operatorDecision } : {}),
    ...(question.conflictId ? { conflictId: question.conflictId } : {}),
  };
}

function appendQuestionConflictEvents(stateLogPath, questionConflicts, eventRecords, context = {}) {
  if (!questionConflicts.length) {
    return [];
  }

  const existingConflictIds = new Set(
    eventRecords
      .filter((record) => record.event === QUESTION_CONFLICT_EVENT)
      .map((record) => normalizeQuestionId(record.conflictId))
      .filter(Boolean),
  );
  const rows = [];

  for (const conflict of questionConflicts) {
    if (existingConflictIds.has(conflict.conflictId)) {
      continue;
    }

    rows.push({
      type: 'event',
      event: QUESTION_CONFLICT_EVENT,
      mode: 'research',
      run: context.run ?? null,
      conflictId: conflict.conflictId,
      questionId: conflict.questionId,
      inboxId: conflict.inboxId,
      operatorDecision: conflict.operatorDecision,
      inboxValue: conflict.inboxValue,
      registryValue: conflict.registryValue,
      source: conflict.source,
      origin: conflict.origin,
      injectedAtIteration: conflict.injectedAtIteration,
      timestamp: context.timestamp || new Date().toISOString(),
      sessionId: context.sessionId ?? null,
      generation: context.generation ?? null,
    });
  }

  if (rows.length) {
    fs.appendFileSync(stateLogPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
  }

  return rows;
}

/**
 * Resolve strategy and inbox question inputs against the canonical registry.
 *
 * @param {Object} inputs - Question source inputs.
 * @param {Array<Object>} inputs.strategyQuestions - Questions parsed from the strategy projection.
 * @param {Array<Object>} inputs.inboxQuestions - Immutable injected question rows.
 * @param {Object|null} inputs.priorRegistry - Prior reducer registry, when available.
 * @returns {{questions: Array<Object>, questionConflicts: Array<Object>}} Resolved canonical questions and conflict records.
 */
function resolveQuestionConflicts({ strategyQuestions, inboxQuestions, priorRegistry }) {
  const priorQuestions = collectPriorRegistryQuestions(priorRegistry);
  if (!priorQuestions.length) {
    return {
      questions: mergeQuestionSources(strategyQuestions, inboxQuestions),
      questionConflicts: [],
    };
  }

  const questions = priorQuestions.map((question) => ({ ...question }));
  const index = indexCanonicalQuestions(questions);
  const questionConflicts = [];

  for (const strategyQuestion of strategyQuestions) {
    const questionIndex = findCanonicalQuestionIndex(index, strategyQuestion);
    if (questionIndex !== undefined) {
      continue;
    }
    const question = normalizeRegistryQuestion(strategyQuestion, questions.length);
    if (question) {
      addIndexedQuestion(questions, index, question);
    }
  }

  for (const inboxQuestion of inboxQuestions) {
    const questionIndex = findCanonicalQuestionIndex(index, inboxQuestion);
    if (questionIndex === undefined) {
      const question = normalizeRegistryQuestion(inboxQuestion, questions.length);
      if (question) {
        addIndexedQuestion(questions, index, question);
      }
      continue;
    }

    const registryQuestion = questions[questionIndex];
    const registryValue = normalizeText(registryQuestion.text);
    const inboxValue = normalizeText(inboxQuestion.text);
    if (registryValue === inboxValue) {
      updateIndexedQuestion(
        questions,
        index,
        questionIndex,
        mergeQuestionMetadata(registryQuestion, inboxQuestion),
      );
      continue;
    }

    const operatorDecision = normalizeQuestionDecision(registryQuestion.operatorDecision)
      || DEFAULT_QUESTION_DECISION;
    const conflict = buildQuestionConflict(registryQuestion, inboxQuestion, operatorDecision);
    questionConflicts.push(conflict);
    updateIndexedQuestion(
      questions,
      index,
      questionIndex,
      applyQuestionConflictDecision(registryQuestion, inboxQuestion, operatorDecision, conflict),
    );
  }

  return {
    questions: mergeQuestionSources([], questions.filter(Boolean)),
    questionConflicts,
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
  const rejectedIndex = registry.rejectedPatternIndex;
  const latestBlockedStop = Array.isArray(registry.blockedStopHistory)
    ? registry.blockedStopHistory.at(-1)
    : null;
  const latestIteration = Array.isArray(iterationRecords) ? iterationRecords.at(-1) : null;

  if (latestBlockedStop) {
    const latestBlockedTimestamp = getTimestampValue(latestBlockedStop.timestamp);
    const latestIterationTimestamp = getTimestampValue(latestIteration?.timestamp);

    if (latestBlockedTimestamp > latestIterationTimestamp) {
      const recoveryStrategy = latestBlockedStop.recoveryStrategy || '[No recovery strategy recorded]';
      const recoveryMatch = findRejectedPatternMatch(
        { text: recoveryStrategy, category: 'recovery' },
        rejectedIndex,
        { category: 'recovery' },
      );
      if (!recoveryMatch) {
        return [
          `BLOCKED on: ${formatBlockedByList(latestBlockedStop.blockedBy)}`,
          `Recovery: ${recoveryStrategy}`,
          'Address the blocking gates before the next iteration.',
        ].join('\n');
      }
    }
  }

  const filteredInputs = filterNextFocusInputs(registry, iterationFiles, iterationRecords);
  const continuityFocus = deriveNextFocusFromContinuity({
    iterationFiles: filteredInputs.iterationFiles,
    iterationRecords: filteredInputs.iterationRecords,
    carriedForwardOpenQuestions: filteredInputs.carriedForwardOpenQuestions,
    machineOpenQuestions: filteredInputs.openQuestions,
  });

  const normalizedFocus = normalizeOptionalText(continuityFocus).toLowerCase();
  const shouldUseIdeaFocus = !normalizedFocus
    || normalizedFocus === '[none yet]'
    || normalizedFocus === '[all tracked questions are resolved]';
  if (!shouldUseIdeaFocus) {
    return continuityFocus;
  }

  const promotedIdea = Array.isArray(registry.promotedIdeas)
    ? registry.promotedIdeas[0]
    : null;
  return promotedIdea?.idea || continuityFocus;
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
    const id = normalizeQuestionId(question.id);
    const promotedQuestionId = normalizeQuestionId(question.promotedQuestionId);
    const inboxId = normalizeQuestionId(question.inboxId);
    const injectedAtIteration = normalizeQuestionIteration(question.injectedAtIteration);
    const operatorDecision = normalizeQuestionDecision(question.operatorDecision);
    const conflictId = normalizeQuestionId(question.conflictId);
    return {
      id: id || promotedQuestionId || `question-${index + 1}-${slugify(normalized)}`,
      inboxId,
      text: normalized,
      origin: normalizeQuestionOrigin(question.origin),
      source: normalizeQuestionSource(question.source, LEGACY_IMPORT_SOURCE),
      injectedAtIteration,
      promotedQuestionId,
      ...(operatorDecision ? { operatorDecision } : {}),
      ...(conflictId ? { conflictId } : {}),
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
  const rejectedPatternIndex = deriveRejectedPatternIndex(eventRecords, {
    fuzzyThreshold: reducerState.rejectedPatternFuzzyThreshold,
  });
  const rejectedPatterns = rejectedPatternIndex.entries.map(serializeRejectedPatternEntry);
  const ideaBacklog = deriveIdeaBacklog(eventRecords, {
    minIdeaObservations: reducerState.minIdeaObservations,
    rejectedIndex: rejectedPatternIndex,
  });
  const graphConvergence = buildGraphConvergenceRollup(eventRecords);
  const lineage = reducerState.lineage && typeof reducerState.lineage === 'object'
    ? reducerState.lineage
    : {};
  const openQuestions = keyedQuestions.filter((question) => !question.resolved).map((question) => ({
    ...buildQuestionFields({
      ...question,
      resolvedAtIteration: null,
    }),
  }));
  const questionConflicts = Array.isArray(reducerState.questionConflicts)
    ? reducerState.questionConflicts
    : [];
  const carriedForwardOpenQuestions = buildCarriedForwardOpenQuestions({
    iterationFiles,
    iterationRecords,
    machineOpenQuestions: openQuestions,
  });
  const suppressedCandidates = buildSuppressedNextFocusCandidates({
    openQuestions,
    carriedForwardOpenQuestions,
    promotedIdeas: ideaBacklog.promotedIdeas,
    iterationFiles,
    iterationRecords,
    blockedStopHistory,
    rejectedIndex: rejectedPatternIndex,
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
      ...buildQuestionFields(question),
      resolved: question.resolved,
    })),
    openQuestions,
    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
      ...buildQuestionFields(question),
    })),
    carriedForwardOpenQuestions,
    uncoveredQuestions,
    keyFindings,
    ruledOutDirections,
    rejectedPatterns,
    rejectedPatternIndex: {
      maxEntries: rejectedPatternIndex.maxEntries,
      fuzzyThreshold: rejectedPatternIndex.fuzzyThreshold,
      entries: rejectedPatterns,
    },
    rejectedPatternWarnings: rejectedPatternIndex.warnings,
    suppressedCandidates,
    minIdeaObservations: ideaBacklog.minIdeaObservations,
    observedIdeas: ideaBacklog.observedIdeas,
    promotedIdeas: ideaBacklog.promotedIdeas,
    suppressedIdeas: ideaBacklog.suppressedIdeas,
    blockedStopHistory,
    graphConvergenceScore: graphConvergence.graphConvergenceScore,
    graphDecision: graphConvergence.graphDecision,
    graphBlockers: graphConvergence.graphBlockers,
    ...(questionConflicts.length ? { questionConflicts } : {}),
    metrics: {
      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
      carriedForwardOpenQuestions: carriedForwardOpenQuestions.length,
      keyFindings: keyFindings.length,
      rejectedPatterns: rejectedPatterns.length,
      suppressedCandidates: suppressedCandidates.length,
      observedIdeas: ideaBacklog.observedIdeas.length,
      promotedIdeas: ideaBacklog.promotedIdeas.length,
      suppressedIdeas: ideaBacklog.suppressedIdeas.length,
      ...(questionConflicts.length ? { questionConflicts: questionConflicts.length } : {}),
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
  if (registry.rejectedPatterns.length || registry.suppressedCandidates.length) {
    const rejectedPatternLines = registry.rejectedPatterns
      .map((entry) => `- ${entry.pattern} [${entry.category}]${entry.reason ? ` — ${entry.reason}` : ''}`);
    const suppressedLines = registry.suppressedCandidates
      .map((entry) =>
        `- Suppressed ${entry.category}: ${entry.candidateText} (${entry.matchType} match to ${entry.rejectedPattern})`,
      );
    updated = upsertAnchorSectionBefore(
      updated,
      'rejected-pattern-cache',
      '11B. REJECTED PATTERN CACHE',
      blockFromBulletList(rejectedPatternLines.concat(suppressedLines)),
      'next-focus',
    );
  }
  if (registry.observedIdeas.length || registry.promotedIdeas.length || registry.suppressedIdeas.length) {
    const observedLines = registry.observedIdeas
      .map((entry) =>
        `- Observed ${entry.observationCount}/${registry.minIdeaObservations}: ${entry.idea} [${entry.category}]`,
      );
    const promotedLines = registry.promotedIdeas
      .map((entry) =>
        `- Promoted #${entry.rank}: ${entry.idea} (${entry.observationCount} observations)`,
      );
    const suppressedLines = registry.suppressedIdeas
      .map((entry) =>
        `- Suppressed: ${entry.idea} (${entry.matchType} match to ${entry.rejectedPattern})`,
      );
    updated = upsertAnchorSectionBefore(
      updated,
      'ideas-backlog',
      '11C. IDEAS BACKLOG',
      blockFromBulletList(promotedLines.concat(observedLines, suppressedLines)),
      'next-focus',
    );
  }
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
  const rejectedPatternLines = registry.rejectedPatterns
    .map((entry) => `- ${entry.pattern} [${entry.category}]${entry.reason ? ` — ${entry.reason}` : ''}`);
  const suppressedCandidateLines = registry.suppressedCandidates
    .map((entry) =>
      `- ${entry.candidateText} suppressed by ${entry.rejectedPattern} (${entry.matchType}, ${entry.similarity.toFixed(2)})`,
    );
  const rejectedPatternWarningLines = Array.isArray(registry.rejectedPatternWarnings)
    ? registry.rejectedPatternWarnings.map((warning) => `- ${warning}`)
    : [];
  const observedIdeaLines = registry.observedIdeas
    .map((entry) => `- ${entry.idea} [${entry.category}] observed ${entry.observationCount}/${registry.minIdeaObservations}`);
  const promotedIdeaLines = registry.promotedIdeas
    .map((entry) => `- #${entry.rank} ${entry.idea} (${entry.observationCount} observations)`);
  const suppressedIdeaLines = registry.suppressedIdeas
    .map((entry) => `- ${entry.idea} suppressed by ${entry.rejectedPattern} (${entry.matchType})`);
  const ideasBacklogSection = observedIdeaLines.length || promotedIdeaLines.length || suppressedIdeaLines.length
    ? [
        '<!-- ANCHOR:ideas-backlog -->',
        '## Ideas Backlog',
        `- minIdeaObservations: ${registry.minIdeaObservations}`,
        `- Observed ideas: ${observedIdeaLines.length}`,
        `- Promoted ideas: ${promotedIdeaLines.length}`,
        `- Suppressed ideas: ${suppressedIdeaLines.length}`,
        ...promotedIdeaLines,
        ...observedIdeaLines,
        ...suppressedIdeaLines,
        '',
        '<!-- /ANCHOR:ideas-backlog -->',
      ]
    : [];
  const rejectedPatternSection = rejectedPatternLines.length || suppressedCandidateLines.length || rejectedPatternWarningLines.length
    ? [
        '<!-- ANCHOR:rejected-pattern-cache -->',
        '## Rejected Pattern Cache',
        `- Active rejected patterns: ${rejectedPatternLines.length}`,
        `- Suppressed candidates: ${suppressedCandidateLines.length}`,
        ...rejectedPatternLines,
        ...suppressedCandidateLines,
        ...rejectedPatternWarningLines,
        '',
        '<!-- /ANCHOR:rejected-pattern-cache -->',
      ]
    : [];
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
    ...ideasBacklogSection,
    ...rejectedPatternSection,
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
  const documentedRegistryPath = path.join(researchDir, 'deep-research-findings-registry.json');
  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
  const resourceMapPath = path.join(researchDir, 'resource-map.md');
  const inboxPath = path.join(researchDir, INBOX_FILE_NAME);
  const iterationDir = path.join(researchDir, 'iterations');
  const deltaDir = path.join(researchDir, 'deltas');

  const config = readJson(configPath);
  const { records: parsedRecords, corruptionWarnings } = readStateLogForReduction(stateLogPath, requireExistingState);
  // Allowlist: only iteration + event types bear completion semantics. Progress
  // records (type:'progress') are additive liveness signals — they reset the
  // no-progress watchdog but MUST NOT count as iterations or completion events.
  const completionBearingRecords = filterCompletionBearingRecords(parsedRecords);
  const records = completionBearingRecords.filter((record) => record.type === 'iteration');
  const events = completionBearingRecords.filter((record) => record.type === 'event');
  const strategyContent = readUtf8(strategyPath);
  const strategyQuestions = parseStrategyQuestions(strategyContent);
  const inbox = readInboxQuestions(inboxPath);
  const priorRegistry = readPriorQuestionRegistry(registryPath, documentedRegistryPath);
  const questionResolution = resolveQuestionConflicts({
    strategyQuestions,
    inboxQuestions: inbox.questions,
    priorRegistry,
  });
  const questionInputs = questionResolution.questions;
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

  const terminalStop = buildTerminalStopState(completionBearingRecords);
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
    questionConflicts: questionResolution.questionConflicts,
    rejectedPatternFuzzyThreshold: resolveRejectedPatternFuzzyThreshold(config),
    minIdeaObservations: resolveMinIdeaObservations(config),
  });
  // Expose corruptionWarnings as a top-level registry field for parity with
  // deep-review.
  registry.corruptionWarnings = corruptionWarnings;
  registry.inboxPath = inboxPath;
  registry.inboxWarnings = inbox.warnings;
  registry.status = status;
  if (write) {
    for (const warning of registry.rejectedPatternWarnings) {
      console.warn(warning);
    }
  }
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
    appendQuestionConflictEvents(stateLogPath, questionResolution.questionConflicts, events, {
      run: records.at(-1)?.run ?? null,
      sessionId: registry.sessionId || null,
      generation: registry.generation ?? null,
    });
    appendIdeaPromotionEvents(stateLogPath, registry.promotedIdeas, events, {
      run: records.at(-1)?.run ?? null,
      minIdeaObservations: registry.minIdeaObservations,
      sessionId: registry.sessionId || null,
      generation: registry.generation ?? null,
    });
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
  deriveRejectedPatternIndex,
  deriveDashboardStatus,
  filterRejectedIdeaCandidates,
  findRejectedPatternMatch,
  parseIterationFile,
  parseJsonl,
  parseJsonlDetailed,
  reduceResearchState,
  renderSparkline,
  readStateLogForReduction,
  resolveQuestionConflicts,
};
