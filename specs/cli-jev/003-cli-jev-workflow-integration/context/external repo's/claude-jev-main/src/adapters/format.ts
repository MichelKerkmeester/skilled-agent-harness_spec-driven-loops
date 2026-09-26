import type { AnswerMap, Usage } from '../domain/question.js';
import { RISK_LEVELS } from '../domain/catalog/options.js';
import { SEVERITY_LEVELS } from '../domain/catalog/review.js';
import type { ReviewJudgement } from '../domain/catalog/review.js';
import type { DecisionReading } from '../domain/catalog/options.js';
import type { HypothesisReading } from '../domain/catalog/hypotheses.js';
import type { RelevanceReading } from '../domain/catalog/relevance.js';

interface Meta {
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

const SEVERITY_MAX = SEVERITY_LEVELS.length - 1;
const RISK_MAX = RISK_LEVELS.length - 1;

function p(value: number): string {
  return value.toFixed(2);
}

function footer(meta: Meta, lead?: string): string {
  const parts = [
    meta.model,
    `${meta.requests} request${meta.requests === 1 ? '' : 's'}`,
    `state ~${meta.stateTokens} tok`,
    `${meta.usage.inputTokens} input tok`,
  ];
  return [lead, parts.join(' · ')].filter((part) => part !== undefined).join(' · ');
}

function distribution(probabilities: Readonly<Record<string, number>>): string {
  return Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => `${key} ${p(value)}`)
    .join(', ');
}

export function formatAnswers(answers: AnswerMap, meta: Meta): string {
  const lines = Object.entries(answers).map(([name, answer]) => {
    switch (answer.type) {
      case 'noul':
        return `${name}  noul ${p(answer.noul)}`;
      case 'choice':
        return `${name}  choice ${answer.choice}  conf ${p(answer.confidence)}  [${distribution(answer.probabilities)}]`;
      case 'score': {
        const max = Object.keys(answer.probabilities).length - 1;
        return `${name}  score ${answer.score.toFixed(2)}/${max}  conf ${p(answer.confidence)}  [${distribution(answer.probabilities)}]`;
      }
    }
  });
  return [...lines, '', footer(meta)].join('\n');
}

export function formatReview(judgements: readonly ReviewJudgement[], meta: Meta): string {
  const lines = judgements.map(
    (judgement) =>
      `${judgement.verdict.padEnd(8)} ${judgement.id}  real ${p(judgement.real)}  reach ${p(judgement.reachable)}  guarded ${p(judgement.alreadyHandled)}  severity ${judgement.severity.toFixed(2)}/${SEVERITY_MAX} (conf ${p(judgement.severityConfidence)})  ${judgement.reason}`,
  );
  const kept = judgements.filter((judgement) => judgement.verdict !== 'drop').length;
  const lead = `${kept} of ${judgements.length} findings survive`;
  return [
    ...lines,
    '',
    `severity levels: ${SEVERITY_LEVELS.map((level, index) => `${index}=${level.split(':')[0]}`).join(', ')}`,
    footer(meta, lead),
  ].join('\n');
}

export function formatDecision(reading: DecisionReading, meta: Meta): string {
  const header = [
    `best      ${reading.best}  conf ${p(reading.bestConfidence)}`,
    `safest    ${reading.safest}  conf ${p(reading.safestConfidence)}`,
    `simplest  ${reading.simplest}  conf ${p(reading.simplestConfidence)}`,
  ];
  const notes: string[] = [];
  if (reading.unanimous) notes.push('all three questions agree');
  else notes.push('the three questions disagree; the trade-off is yours to make');
  if (reading.flat) notes.push('at least one distribution is flat, so read it as a weak preference');

  const rows = reading.options.map(
    (option) =>
      `${option.label}  best ${p(option.best)}  safest ${p(option.safest)}  simplest ${p(option.simplest)}  risk ${option.risk.toFixed(2)}/${RISK_MAX}`,
  );
  return [...header, '', ...rows, '', notes.join('; '), footer(meta)].join('\n');
}

export function formatHypotheses(readings: readonly HypothesisReading[], meta: Meta): string {
  const lines = readings.map(
    (reading, index) =>
      `${index + 1}. ${reading.id}  rank ${p(reading.rank)}  explains ${p(reading.explains)}  supported ${p(reading.supported)}  next: ${reading.nextCheck} (conf ${p(reading.nextCheckConfidence)})`,
  );
  return [...lines, '', footer(meta, 'rank = 0.6 explains + 0.4 supported')].join('\n');
}

export function formatRelevance(
  kept: readonly RelevanceReading[],
  dropped: readonly RelevanceReading[],
  meta: Meta,
): string {
  const keepLines = kept.map((reading) => `  ${p(reading.needed)}  ${reading.label}`);
  const dropLine = dropped.map((reading) => `${reading.label} ${p(reading.needed)}`).join(', ');
  return [
    `keep (${kept.length}):`,
    ...(keepLines.length > 0 ? keepLines : ['  nothing passed the threshold']),
    `drop (${dropped.length}): ${dropLine || 'none'}`,
    '',
    footer(meta),
  ].join('\n');
}
