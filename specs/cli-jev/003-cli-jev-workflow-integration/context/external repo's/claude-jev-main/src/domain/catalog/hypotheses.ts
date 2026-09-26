import type { AnswerMap, QuestionMap } from '../question.js';
import { choiceOf, noulOf } from '../question.js';

export interface Hypothesis {
  readonly id: string;
  /** One sentence: the cause this hypothesis proposes. */
  readonly claim: string;
}

export const NEXT_CHECK_OPTIONS = {
  read_code: 'Reading more of the existing code settles it, no execution needed',
  run_test: 'An existing test or a quick one-off run settles it',
  reproduce: 'It needs a reproduction of the failing scenario',
  instrument: 'It needs new logging or instrumentation before anything can be seen',
} as const;

export const HYPOTHESIS_WEIGHTS = {
  explains: 0.6,
  supported: 0.4,
} as const;

export function hypothesisQuestions(hypothesis: Hypothesis): QuestionMap {
  const { id } = hypothesis;
  return {
    [`explains_${id}`]: {
      type: 'noul',
      instructions: `If \`hypotheses.${id}.claim\` were true, it would produce the whole symptom described in \`symptom\`, not just part of it.`,
      criteria: {
        true: 'It accounts for the entire symptom',
        false: 'It accounts for none of the symptom, or only part of it',
      },
    },
    [`supported_${id}`]: {
      type: 'noul',
      instructions: `The code in \`sources\` and the observations in \`evidence\` support \`hypotheses.${id}.claim\`.`,
      criteria: {
        true: 'Something shown points at this cause',
        false: 'Nothing shown points at it, or what is shown contradicts it',
      },
    },
    [`next_check_${id}`]: {
      type: 'choice',
      instructions: `What is the cheapest way to confirm or rule out \`hypotheses.${id}.claim\`?`,
      criteria: NEXT_CHECK_OPTIONS,
    },
  };
}

export interface HypothesisReading {
  readonly id: string;
  readonly rank: number;
  readonly explains: number;
  readonly supported: number;
  readonly nextCheck: string;
  readonly nextCheckConfidence: number;
}

export function readHypothesis(hypothesis: Hypothesis, answers: AnswerMap): HypothesisReading {
  const explains = noulOf(answers, `explains_${hypothesis.id}`);
  const supported = noulOf(answers, `supported_${hypothesis.id}`);
  const nextCheck = choiceOf(answers, `next_check_${hypothesis.id}`);
  return {
    id: hypothesis.id,
    rank: HYPOTHESIS_WEIGHTS.explains * explains + HYPOTHESIS_WEIGHTS.supported * supported,
    explains,
    supported,
    nextCheck: nextCheck.choice,
    nextCheckConfidence: nextCheck.confidence,
  };
}

export function byRank(a: HypothesisReading, b: HypothesisReading): number {
  return b.rank - a.rank;
}
