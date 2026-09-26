import type { Usage } from '../domain/question.js';
import {
  decisionQuestions,
  readDecision,
  type Decision,
  type DecisionReading,
} from '../domain/catalog/options.js';
import { askAll } from './fan-out.js';
import type { JevDeps } from './ask.js';
import type { SourceRequest } from './ports.js';
import { sourcesField } from './state.js';

export interface PickInput {
  readonly decision: Decision;
  readonly sources: readonly SourceRequest[];
}

export interface PickResult extends DecisionReading {
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

export async function pickOption(deps: JevDeps, input: PickInput): Promise<PickResult> {
  const snippets = await deps.reader.read(input.sources);
  const state = {
    decision: input.decision.question,
    requirement: input.decision.requirement,
    sources: sourcesField(snippets),
  };
  const fanOut = await askAll(
    deps.jev,
    state,
    decisionQuestions(input.decision),
    deps.maxRequests,
  );
  return {
    ...readDecision(input.decision, fanOut.answers),
    model: fanOut.model,
    usage: fanOut.usage,
    requests: fanOut.requests,
    stateTokens: fanOut.stateTokens,
  };
}
