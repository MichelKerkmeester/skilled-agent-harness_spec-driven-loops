import { TypeSafeClient } from '@typesafe-ai/sdk';
import type { Fetch, ModelCard, Question as SdkQuestion, Questions as SdkQuestions } from '@typesafe-ai/sdk';
import type { JevPort, JevReply } from '../application/ports.js';
import type { Answer, Question, QuestionMap, StateEntry } from '../domain/question.js';

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      'no TypeSafe API key: export TYPESAFE_API_KEY, or set the plugin API key option, then reload the plugin',
    );
    this.name = 'MissingApiKeyError';
  }
}

export class MalformedAnswerError extends Error {
  constructor(name: string) {
    super(`Jev returned an answer for "${name}" that does not match any known type`);
    this.name = 'MalformedAnswerError';
  }
}

function scoreCriteria(levels: readonly string[]): readonly [string, string, ...string[]] {
  const [first, second, ...rest] = levels;
  if (first === undefined || second === undefined) {
    throw new Error('a score question needs at least two levels');
  }
  return [first, second, ...rest];
}

function toSdkQuestion(question: Question): SdkQuestion {
  switch (question.type) {
    case 'noul': {
      const criteria = question.criteria;
      if (criteria === undefined) return { type: 'noul', instructions: question.instructions };
      return {
        type: 'noul',
        instructions: question.instructions,
        criteria: {
          ...(criteria.true === undefined ? {} : { true: criteria.true }),
          ...(criteria.false === undefined ? {} : { false: criteria.false }),
        },
      };
    }
    case 'choice':
      return { type: 'choice', instructions: question.instructions, criteria: question.criteria };
    case 'score':
      return {
        type: 'score',
        instructions: question.instructions,
        criteria: scoreCriteria(question.criteria),
      };
  }
}

function numbers(source: object): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
  }
  return out;
}

function descriptions(source: object): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    out[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }
  return out;
}

function toDomainAnswer(name: string, answer: unknown): Answer {
  if (answer === null || typeof answer !== 'object') throw new MalformedAnswerError(name);
  const record: Record<string, unknown> = { ...answer };
  if (typeof record['noul'] === 'number') {
    return { type: 'noul', noul: record['noul'] };
  }
  if (typeof record['choice'] === 'string' && typeof record['confidence'] === 'number') {
    return {
      type: 'choice',
      choice: record['choice'],
      confidence: record['confidence'],
      probabilities: numbers(Object(record['probabilities'])),
    };
  }
  if (typeof record['score'] === 'number' && typeof record['confidence'] === 'number') {
    return {
      type: 'score',
      score: record['score'],
      confidence: record['confidence'],
      legend: descriptions(Object(record['legend'])),
      probabilities: numbers(Object(record['probabilities'])),
    };
  }
  throw new MalformedAnswerError(name);
}

export interface TypeSafeJevOptions {
  readonly apiKey: string;
  readonly model: string;
  /** Injectable transport; the global fetch is used when omitted. */
  readonly fetch?: Fetch | undefined;
}

/** The only place that speaks HTTP to TypeSafe. */
export class TypeSafeJev implements JevPort {
  private client: TypeSafeClient | undefined;

  constructor(private readonly options: TypeSafeJevOptions) {}

  async ask(state: StateEntry, questions: QuestionMap): Promise<JevReply> {
    const sdkQuestions: SdkQuestions = Object.fromEntries(
      Object.entries(questions).map(([name, question]) => [name, toSdkQuestion(question)]),
    );
    const result = await this.connect().systemOne({ state, questions: sdkQuestions });
    const answers = Object.fromEntries(
      Object.entries(result.answers).map(([name, answer]) => [name, toDomainAnswer(name, answer)]),
    );
    return {
      model: result.model,
      answers,
      usage: {
        inputTokens: result.usage.input_tokens,
        outputTokens: result.usage.output_tokens,
      },
    };
  }

  async models(): Promise<readonly ModelCard[]> {
    return this.connect().models.list();
  }

  private connect(): TypeSafeClient {
    if (this.options.apiKey.length === 0) throw new MissingApiKeyError();
    this.client ??= new TypeSafeClient({
      apiKey: this.options.apiKey,
      defaultModel: this.options.model,
      ...(this.options.fetch === undefined ? {} : { fetch: this.options.fetch }),
    });
    return this.client;
  }
}
