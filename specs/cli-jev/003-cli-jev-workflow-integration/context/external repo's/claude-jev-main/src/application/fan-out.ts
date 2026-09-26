import { planBatches } from '../domain/budget.js';
import type { Answer, AnswerMap, QuestionMap, StateEntry, Usage } from '../domain/question.js';
import type { JevPort } from './ports.js';

export interface FanOut {
  readonly answers: AnswerMap;
  readonly model: string;
  readonly usage: Usage;
  readonly requests: number;
  readonly stateTokens: number;
}

/**
 * Asks every question about one state, splitting into as many requests as the
 * token limits demand and merging the answers back into a single map.
 */
export async function askAll(
  jev: JevPort,
  state: StateEntry,
  questions: QuestionMap,
  maxRequests: number,
): Promise<FanOut> {
  const plan = planBatches(state, questions, maxRequests);
  const replies = await Promise.all(plan.batches.map((batch) => jev.ask(state, batch)));

  const answers: Record<string, Answer> = {};
  const models = new Set<string>();
  let inputTokens = 0;
  let outputTokens = 0;
  for (const reply of replies) {
    Object.assign(answers, reply.answers);
    models.add(reply.model);
    inputTokens += reply.usage.inputTokens;
    outputTokens += reply.usage.outputTokens;
  }
  return {
    answers,
    model: [...models].join(', '),
    usage: { inputTokens, outputTokens },
    requests: replies.length,
    stateTokens: plan.stateTokens,
  };
}
