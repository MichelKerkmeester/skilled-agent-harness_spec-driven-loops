import type { AnswerMap, QuestionMap } from '../question.js';
import { noulOf } from '../question.js';

export interface Candidate {
  readonly id: string;
  /** How the candidate is named in the state, usually its path. */
  readonly label: string;
}

export const RELEVANCE_THRESHOLDS = {
  /** At or above this the candidate is worth reading in full. */
  needed: 0.5,
} as const;

export function relevanceQuestions(candidate: Candidate): QuestionMap {
  return {
    [`needed_${candidate.id}`]: {
      type: 'noul',
      instructions: `The content shown under \`candidates.${candidate.id}\` is needed to answer the question in \`goal\`.`,
      criteria: {
        true: 'It holds part of the answer, or code the answer depends on',
        false: 'It is unrelated, or only mentions the same words',
      },
    },
  };
}

export interface RelevanceReading {
  readonly id: string;
  readonly label: string;
  readonly needed: number;
  readonly keep: boolean;
}

export function readRelevance(candidate: Candidate, answers: AnswerMap): RelevanceReading {
  const needed = noulOf(answers, `needed_${candidate.id}`);
  return {
    id: candidate.id,
    label: candidate.label,
    needed,
    keep: needed >= RELEVANCE_THRESHOLDS.needed,
  };
}

export function byNeed(a: RelevanceReading, b: RelevanceReading): number {
  return b.needed - a.needed;
}
