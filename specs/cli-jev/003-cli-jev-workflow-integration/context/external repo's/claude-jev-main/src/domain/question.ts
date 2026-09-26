export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type StateEntry = string | JsonValue[] | { [key: string]: JsonValue };

export interface NoulQuestion {
  readonly type: 'noul';
  readonly instructions: string;
  readonly criteria?: {
    readonly true?: string | undefined;
    readonly false?: string | undefined;
  } | undefined;
}

export interface ChoiceQuestion {
  readonly type: 'choice';
  readonly instructions: string;
  readonly criteria: Readonly<Record<string, string | null>>;
}

export interface ScoreQuestion {
  readonly type: 'score';
  readonly instructions: string;
  readonly criteria: readonly string[];
}

export type Question = NoulQuestion | ChoiceQuestion | ScoreQuestion;

export type QuestionMap = Readonly<Record<string, Question>>;

export interface NoulAnswer {
  readonly type: 'noul';
  readonly noul: number;
}

export interface ChoiceAnswer {
  readonly type: 'choice';
  readonly choice: string;
  readonly confidence: number;
  readonly probabilities: Readonly<Record<string, number>>;
}

export interface ScoreAnswer {
  readonly type: 'score';
  readonly score: number;
  readonly confidence: number;
  readonly legend: Readonly<Record<string, string>>;
  readonly probabilities: Readonly<Record<string, number>>;
}

export type Answer = NoulAnswer | ChoiceAnswer | ScoreAnswer;

export type AnswerMap = Readonly<Record<string, Answer>>;

export interface Usage {
  readonly inputTokens: number;
  readonly outputTokens: number;
}

export class MissingAnswerError extends Error {
  constructor(name: string, expected: Answer['type']) {
    super(`Jev returned no usable ${expected} answer for "${name}"`);
    this.name = 'MissingAnswerError';
  }
}

function probability(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : Number.NaN;
}

export function noulOf(answers: AnswerMap, name: string): number {
  const answer = answers[name];
  if (answer?.type !== 'noul' || !Number.isFinite(answer.noul)) {
    throw new MissingAnswerError(name, 'noul');
  }
  return probability(answer.noul);
}

export function choiceOf(answers: AnswerMap, name: string): ChoiceAnswer {
  const answer = answers[name];
  if (answer?.type !== 'choice' || typeof answer.choice !== 'string') {
    throw new MissingAnswerError(name, 'choice');
  }
  return answer;
}

export function scoreOf(answers: AnswerMap, name: string): ScoreAnswer {
  const answer = answers[name];
  if (answer?.type !== 'score' || !Number.isFinite(answer.score)) {
    throw new MissingAnswerError(name, 'score');
  }
  return answer;
}
