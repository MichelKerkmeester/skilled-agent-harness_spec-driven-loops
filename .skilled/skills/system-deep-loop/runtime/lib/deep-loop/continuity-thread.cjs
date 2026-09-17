// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Continuity Threading Helpers                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const crypto = require('node:crypto');

const DEFAULT_TERMINAL_NEXT_FOCUS = '[All tracked questions are resolved]';
const MAX_DERIVED_FOCUS_LENGTH = 220;

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function contentOrderKey(value) {
  return crypto.createHash('sha256').update(normalizeKey(value)).digest('hex');
}

function textFromQuestion(value) {
  if (typeof value === 'string') {
    return normalizeText(value);
  }
  if (value && typeof value === 'object' && typeof value.text === 'string') {
    return normalizeText(value.text);
  }
  return '';
}

function toTextArray(value) {
  return Array.isArray(value)
    ? value.map(textFromQuestion).filter(Boolean)
    : [];
}

function getRunNumber(item) {
  return Number.isFinite(item?.run)
    ? item.run
    : Number.isFinite(item?.iteration)
      ? item.iteration
      : 0;
}

function truncateFocus(value) {
  const normalized = normalizeText(value);
  if (normalized.length <= MAX_DERIVED_FOCUS_LENGTH) {
    return normalized;
  }
  return `${normalized.slice(0, MAX_DERIVED_FOCUS_LENGTH - 3).trimEnd()}...`;
}

function getLatestByRun(items) {
  return [...items].sort((left, right) => getRunNumber(left) - getRunNumber(right)).at(-1) || null;
}

function buildCarriedForwardOpenQuestions({
  iterationFiles = [],
  iterationRecords = [],
  machineOpenQuestions = [],
} = {}) {
  const machineQuestionKeys = new Set(toTextArray(machineOpenQuestions).map(normalizeKey));
  const seen = new Set();
  const candidates = [];

  for (const iteration of iterationFiles) {
    for (const question of toTextArray(iteration.questionsRemaining)) {
      const key = normalizeKey(question);
      if (!key || machineQuestionKeys.has(key) || seen.has(key)) {
        continue;
      }
      seen.add(key);
      candidates.push({
        text: question,
        addedAtIteration: getRunNumber(iteration),
        source: 'iteration-markdown',
      });
    }
  }

  for (const record of iterationRecords) {
    for (const question of toTextArray(record.openQuestions).concat(toTextArray(record.questionsRemaining))) {
      const key = normalizeKey(question);
      if (!key || machineQuestionKeys.has(key) || seen.has(key)) {
        continue;
      }
      seen.add(key);
      candidates.push({
        text: question,
        addedAtIteration: getRunNumber(record),
        source: 'iteration-record',
      });
    }
  }

  return candidates.sort((left, right) =>
    left.addedAtIteration - right.addedAtIteration || contentOrderKey(left.text).localeCompare(contentOrderKey(right.text)),
  );
}

function formatCarriedForwardOpenQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return '[None yet]';
  }

  return questions
    .map((question) => `- ${question.text} (iteration ${question.addedAtIteration || 0})`)
    .join('\n');
}

function deriveNextFocusFromContinuity({
  iterationFiles = [],
  iterationRecords = [],
  carriedForwardOpenQuestions = [],
  machineOpenQuestions = [],
  terminalSentinel = DEFAULT_TERMINAL_NEXT_FOCUS,
} = {}) {
  const machineQuestions = toTextArray(machineOpenQuestions);
  if (machineQuestions.length === 0) {
    return terminalSentinel;
  }

  const latestThreadQuestion = getLatestByRun(carriedForwardOpenQuestions);
  if (latestThreadQuestion?.text) {
    return latestThreadQuestion.text;
  }

  const latestIteration = getLatestByRun(iterationFiles);
  const latestFinding = Array.isArray(latestIteration?.findings)
    ? latestIteration.findings.map(normalizeText).filter(Boolean).at(-1)
    : null;
  if (latestFinding) {
    return `Follow up on: ${truncateFocus(latestFinding)}`;
  }

  const latestRecord = getLatestByRun(iterationRecords);
  const latestRecordFinding = Array.isArray(latestRecord?.findings)
    ? latestRecord.findings.map(textFromQuestion).filter(Boolean).at(-1)
    : null;
  if (latestRecordFinding) {
    return `Follow up on: ${truncateFocus(latestRecordFinding)}`;
  }

  return machineQuestions[0] || terminalSentinel;
}

module.exports = {
  buildCarriedForwardOpenQuestions,
  deriveNextFocusFromContinuity,
  formatCarriedForwardOpenQuestions,
};
