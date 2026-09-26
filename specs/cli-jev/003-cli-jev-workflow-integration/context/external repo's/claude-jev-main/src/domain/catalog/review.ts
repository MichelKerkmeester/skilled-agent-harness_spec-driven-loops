import type { AnswerMap, QuestionMap } from '../question.js';
import { noulOf, scoreOf } from '../question.js';

export interface Finding {
  readonly id: string;
  readonly file: string;
  readonly line?: number | undefined;
  /** One sentence naming the defect. */
  readonly claim: string;
  /** Concrete inputs or state leading to the wrong result. */
  readonly failure: string;
}

export const SEVERITY_LEVELS = [
  'Cosmetic: only wording, formatting or style, behavior is unchanged',
  'Minor: output or logs degrade, the caller still receives a usable result',
  'A normal case breaks: an ordinary input yields a wrong result or an unhandled error',
  'Data loss, corruption or a security hole: state is destroyed or an attacker gains access',
] as const;

export const REVIEW_THRESHOLDS = {
  /** Below this the finding is treated as a false positive. */
  real: 0.5,
  /** At or above this an existing guard already covers the finding. */
  alreadyHandled: 0.7,
  /** Below this the defect looks unreachable, so the finding is demoted. */
  reachable: 0.4,
} as const;

export function reviewQuestions(finding: Finding): QuestionMap {
  const { id } = finding;
  return {
    [`real_${id}`]: {
      type: 'noul',
      instructions: `The code in \`sources\` contains the defect stated in \`findings.${id}.claim\`. Judge the code that is shown; \`findings.${id}.failure\` is the reviewer's claim about the consequence, not evidence.`,
      criteria: {
        true: 'The shown code has the stated defect',
        false: 'The shown code does not have it, or the claim describes intended behavior',
      },
    },
    [`reachable_${id}`]: {
      type: 'noul',
      instructions: `A caller of the code in \`sources\` can reach the defect stated in \`findings.${id}.claim\` during ordinary use of this program.`,
      criteria: {
        true: 'Some ordinary caller or input path reaches it',
        false: 'Dead code, an unreachable branch, or a path no caller can take',
      },
    },
    [`already_handled_${id}`]: {
      type: 'noul',
      instructions: `The code in \`sources\` already guards against the defect stated in \`findings.${id}.claim\`, for example through an earlier check, an assertion, or a type that rules it out.`,
      criteria: {
        true: 'A guard present in the shown code prevents it',
        false: 'No such guard is shown',
      },
    },
    [`severity_${id}`]: {
      type: 'score',
      instructions: `Rate the worst consequence of the defect stated in \`findings.${id}.claim\` if it is triggered in production.`,
      criteria: SEVERITY_LEVELS,
    },
  };
}

export type ReviewVerdict = 'keep' | 'keep_low' | 'drop';

export interface ReviewJudgement {
  readonly id: string;
  readonly verdict: ReviewVerdict;
  readonly reason: string;
  readonly real: number;
  readonly reachable: number;
  readonly alreadyHandled: number;
  readonly severity: number;
  readonly severityConfidence: number;
}

export function judgeFinding(finding: Finding, answers: AnswerMap): ReviewJudgement {
  const real = noulOf(answers, `real_${finding.id}`);
  const reachable = noulOf(answers, `reachable_${finding.id}`);
  const alreadyHandled = noulOf(answers, `already_handled_${finding.id}`);
  const severity = scoreOf(answers, `severity_${finding.id}`);
  const shared = {
    id: finding.id,
    real,
    reachable,
    alreadyHandled,
    severity: severity.score,
    severityConfidence: severity.confidence,
  };
  if (real < REVIEW_THRESHOLDS.real) {
    return { ...shared, verdict: 'drop', reason: 'the defect is probably not in the code' };
  }
  if (alreadyHandled >= REVIEW_THRESHOLDS.alreadyHandled) {
    return { ...shared, verdict: 'drop', reason: 'an existing guard already covers it' };
  }
  if (reachable < REVIEW_THRESHOLDS.reachable) {
    return { ...shared, verdict: 'keep_low', reason: 'real but probably unreachable' };
  }
  return { ...shared, verdict: 'keep', reason: 'real and reachable' };
}

const VERDICT_ORDER: Readonly<Record<ReviewVerdict, number>> = { keep: 0, keep_low: 1, drop: 2 };

/** Keepers first, then the demoted, then the dropped; inside each group the worst consequence leads. */
export function byReviewPriority(a: ReviewJudgement, b: ReviewJudgement): number {
  const order = VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict];
  return order !== 0 ? order : b.severity - a.severity;
}
