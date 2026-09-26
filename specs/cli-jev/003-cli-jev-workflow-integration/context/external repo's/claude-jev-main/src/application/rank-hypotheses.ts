import type { JsonValue, Usage } from '../domain/question.js';
import {
  byRank,
  hypothesisQuestions,
  readHypothesis,
  type Hypothesis,
  type HypothesisReading,
} from '../domain/catalog/hypotheses.js';
import { askAll } from './fan-out.js';
import type { JevDeps } from './ask.js';
import type { SourceRequest } from './ports.js';
import { sourcesField } from './state.js';

export interface RankInput {
  /** The failure as observed, in the words of whoever saw it. */
  readonly symptom: string;
  /** Logs, stack traces, or measurements already collected. */
  readonly evidence?: string | undefined;
  readonly hypotheses: readonly Hypothesis[];
  readonly sources: readonly SourceRequest[];
}

export interface RankResult {
  readonly hypotheses: readonly HypothesisReading[];
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

function hypothesesField(hypotheses: readonly Hypothesis[]): JsonValue {
  return Object.fromEntries(hypotheses.map(({ id, claim }) => [id, { claim }]));
}

export async function rankHypotheses(deps: JevDeps, input: RankInput): Promise<RankResult> {
  const snippets = await deps.reader.read(input.sources);
  const state = {
    symptom: input.symptom,
    ...(input.evidence === undefined ? {} : { evidence: input.evidence }),
    hypotheses: hypothesesField(input.hypotheses),
    sources: sourcesField(snippets),
  };
  const questions = Object.assign({}, ...input.hypotheses.map(hypothesisQuestions));
  const fanOut = await askAll(deps.jev, state, questions, deps.maxRequests);
  return {
    hypotheses: input.hypotheses
      .map((hypothesis) => readHypothesis(hypothesis, fanOut.answers))
      .sort(byRank),
    model: fanOut.model,
    usage: fanOut.usage,
    requests: fanOut.requests,
    stateTokens: fanOut.stateTokens,
  };
}
