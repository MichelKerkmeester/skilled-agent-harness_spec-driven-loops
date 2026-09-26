import type { Question, QuestionMap, StateEntry } from './question.js';

/** Jev accepts this many tokens for state and all questions together. */
export const TOTAL_TOKEN_LIMIT = 64_000;

/** Jev accepts this many tokens for the state plus the single longest question. */
export const STATE_PLUS_QUESTION_LIMIT = 32_000;

/** Request keys, the model name and JSON punctuation around state and questions. */
const ENVELOPE_TOKENS = 64;

export class BudgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetError';
  }
}

/**
 * Tokens a string is worth, deliberately rounded upwards: staying under Jev's
 * limits matters more than packing a request to its last token.
 */
export function estimateTokens(text: string): number {
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let symbols = 0;
  let wide = 0;
  for (const character of text) {
    const code = character.codePointAt(0) ?? 0;
    if (code > 127) wide += 1;
    else if (character >= 'a' && character <= 'z') letters += 1;
    else if (character >= 'A' && character <= 'Z') letters += 1;
    else if (character >= '0' && character <= '9') digits += 1;
    else if (character === ' ' || character === '\n' || character === '\t' || character === '\r') spaces += 1;
    else symbols += 1;
  }
  return Math.ceil(letters / 3 + digits / 2 + spaces / 4 + symbols / 1.5 + wide);
}

export function stateTokens(state: StateEntry): number {
  return estimateTokens(JSON.stringify(state));
}

export function questionTokens(name: string, question: Question): number {
  return estimateTokens(name) + estimateTokens(JSON.stringify(question));
}

export interface BatchPlan {
  readonly batches: readonly QuestionMap[];
  readonly stateTokens: number;
}

/**
 * Splits questions into requests that each carry the whole state. Jev ingests
 * the state once per request, so a fan-out trades tokens for questions that no
 * longer fit beside it.
 */
export function planBatches(
  state: StateEntry,
  questions: QuestionMap,
  maxRequests: number,
): BatchPlan {
  const entries = Object.entries(questions);
  if (entries.length === 0) throw new BudgetError('no questions to ask');

  const stateCost = stateTokens(state);
  const costs = entries.map(([name, question]) => ({
    name,
    question,
    tokens: questionTokens(name, question),
  }));
  const longest = costs.reduce((max, entry) => Math.max(max, entry.tokens), 0);

  if (stateCost + longest + ENVELOPE_TOKENS > STATE_PLUS_QUESTION_LIMIT) {
    throw new BudgetError(
      `state (~${stateCost} tokens) plus the longest question (~${longest}) exceeds Jev's ${STATE_PLUS_QUESTION_LIMIT}-token limit; narrow the line ranges or send fewer sources`,
    );
  }

  const perRequest = TOTAL_TOKEN_LIMIT - stateCost - ENVELOPE_TOKENS;
  const batches: QuestionMap[] = [];
  let current: Record<string, Question> = {};
  let currentTokens = 0;
  for (const { name, question, tokens } of costs) {
    if (currentTokens > 0 && currentTokens + tokens > perRequest) {
      batches.push(current);
      current = {};
      currentTokens = 0;
    }
    current[name] = question;
    currentTokens += tokens;
  }
  if (currentTokens > 0) batches.push(current);

  if (batches.length > maxRequests) {
    throw new BudgetError(
      `${entries.length} questions need ${batches.length} requests, over the limit of ${maxRequests}; ask about fewer items at a time`,
    );
  }
  return { batches, stateTokens: stateCost };
}
