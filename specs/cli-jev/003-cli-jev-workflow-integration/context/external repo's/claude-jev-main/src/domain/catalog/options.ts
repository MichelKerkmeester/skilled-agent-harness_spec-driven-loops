import type { AnswerMap, ChoiceQuestion, QuestionMap } from '../question.js';
import { choiceOf, scoreOf } from '../question.js';

export interface DecisionOption {
  readonly label: string;
  readonly summary: string;
}

export interface Decision {
  /** What is being decided, in one sentence. */
  readonly question: string;
  /** The requirement the winning option has to satisfy. */
  readonly requirement: string;
  readonly options: readonly DecisionOption[];
}

export const RISK_LEVELS = [
  'No risk: self-contained, nothing existing changes behavior',
  'Minor risk: local change, a mistake is caught immediately',
  'Needs care: touches shared code or state, a mistake surfaces later',
  'Likely to break something: wide blast radius, hard to undo',
] as const;

export const PICK_THRESHOLDS = {
  /** Below this the distribution is too flat to read as a preference. */
  lowConfidence: 0.5,
} as const;

/** Question keys stay index-based so a free-text label cannot collide with one. */
export function optionKey(index: number): string {
  return `risk_${index + 1}`;
}

function labelCriteria(options: readonly DecisionOption[]): ChoiceQuestion['criteria'] {
  return Object.fromEntries(options.map((option) => [option.label, option.summary]));
}

export function decisionQuestions(decision: Decision): QuestionMap {
  const criteria = labelCriteria(decision.options);
  const questions: Record<string, QuestionMap[string]> = {
    best: {
      type: 'choice',
      instructions: `Which option satisfies this requirement best for the code in \`sources\`: ${decision.requirement}`,
      criteria,
    },
    safest: {
      type: 'choice',
      instructions: 'Which option is least likely to break the existing behavior of the code in `sources`?',
      criteria,
    },
    simplest: {
      type: 'choice',
      instructions: 'Which option adds the least code and the fewest moving parts?',
      criteria,
    },
  };
  decision.options.forEach((option, index) => {
    questions[optionKey(index)] = {
      type: 'score',
      instructions: `Rate the risk of adopting this option in the code shown in \`sources\`: ${option.label} — ${option.summary}`,
      criteria: RISK_LEVELS,
    };
  });
  return questions;
}

export interface OptionScores {
  readonly label: string;
  readonly best: number;
  readonly safest: number;
  readonly simplest: number;
  readonly risk: number;
}

export interface DecisionReading {
  readonly options: readonly OptionScores[];
  readonly best: string;
  readonly safest: string;
  readonly simplest: string;
  readonly bestConfidence: number;
  readonly safestConfidence: number;
  readonly simplestConfidence: number;
  /** True when all three questions picked the same option. */
  readonly unanimous: boolean;
  /** True when any of the three distributions is too flat to read. */
  readonly flat: boolean;
}

export function readDecision(decision: Decision, answers: AnswerMap): DecisionReading {
  const best = choiceOf(answers, 'best');
  const safest = choiceOf(answers, 'safest');
  const simplest = choiceOf(answers, 'simplest');
  const options = decision.options.map((option, index) => ({
    label: option.label,
    best: best.probabilities[option.label] ?? 0,
    safest: safest.probabilities[option.label] ?? 0,
    simplest: simplest.probabilities[option.label] ?? 0,
    risk: scoreOf(answers, optionKey(index)).score,
  }));
  const confidences = [best.confidence, safest.confidence, simplest.confidence];
  return {
    options,
    best: best.choice,
    safest: safest.choice,
    simplest: simplest.choice,
    bestConfidence: best.confidence,
    safestConfidence: safest.confidence,
    simplestConfidence: simplest.confidence,
    unanimous: best.choice === safest.choice && best.choice === simplest.choice,
    flat: confidences.some((value) => value < PICK_THRESHOLDS.lowConfidence),
  };
}
